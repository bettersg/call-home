###############
## Variables ##
###############

variable "project_id" {
  type = string
  default = "call-home-staging"
}

variable "location" {
  type = string
  default = "asia-southeast1"
}

variable "db_name" {
  type = string
  default = "strapi"
}

variable "db_instance_name" {
  type = string
  default = "strapi-db-instance"
}

variable "db_username" {
  type = string
  sensitive = true
}

variable "db_password" {
  type = string
  sensitive = true
}

// TODO: Default values are not great for reproducibility.
// Over time, we want to move the variable creation to a variable.tfvars file.
variable "frontend_bucket_name" {
  type = string
  default = "call-home-frontend"
}

######################
## Project Settings ##
######################

data "google_project" "project" {
  project_id = var.project_id
}

// Enable Cloud SQL Admin API to allow App Engine to connect to the database
// See: https://cloud.google.com/sql/docs/mysql/connect-app-engine-standard
resource "google_project_service" "sql_admin_api" {
  project = data.google_project.project.project_id
  service = "sqladmin.googleapis.com"
}

// Enable Cloud Build API and grant its service account App Engine and Service Account User
// permissions to allow developers to build and deploy applications to App Engine using gcloud SDK.
// See: https://cloud.google.com/build/docs/deploying-builds/deploy-appengine
resource "google_project_service" "cloud_build_api" {
  project = data.google_project.project.project_id
  service = "cloudbuild.googleapis.com"
}

// Enable App Engine permissions for the Cloud Build service account
resource "google_project_iam_binding" "app_engine_admin" {
  project = data.google_project.project.project_id
  role = "roles/appengine.appAdmin"
  members = [
    "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
  ]
  depends_on = [
    google_project_service.cloud_build_api
  ]
}

// Enable Service Account User permissions for the Cloud Build service account
resource "google_project_iam_binding" "service_account_user" {
  project = data.google_project.project.project_id
  role = "roles/iam.serviceAccountUser"
  members = [
    "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
  ]
  depends_on = [
    google_project_service.cloud_build_api
  ]
}

################
## App Engine ##
################

resource "google_app_engine_application" "app" {
  project = data.google_project.project.project_id
  location_id = var.location
}

##############
## Database ##
##############

resource "google_sql_database_instance" "strapi_db_instance" {
  name = var.db_instance_name
  database_version = "POSTGRES_14"
  project = data.google_project.project.project_id
  region = var.location
  deletion_protection = false
  settings {
    tier = "db-f1-micro"
    maintenance_window {
      day = 7
      hour = 20 # Sunday 8pm (UTC) = Monday 4am (UTC+8)
    }
  }
}

resource "google_sql_database" "strapi_db" {
  name = var.db_name
  instance = google_sql_database_instance.strapi_db_instance.name
  project = data.google_project.project.project_id
}

resource "google_sql_user" "user" {
  name = var.db_username
  password = var.db_password
  instance = google_sql_database_instance.strapi_db_instance.name
  project = data.google_project.project.project_id
}

##############
## Frontend ##
##############

// Create a new storage bucket for frontend assets
resource "google_storage_bucket" "call_home_frontend" {
  project = data.google_project.project.project_id
  name = var.frontend_bucket_name
  location = var.location
  force_destroy = true
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page = "index.html"
  }
}

// Make resources in frontend bucket viewable by anyone
resource "google_storage_bucket_iam_member" "frontend_bucket_viewer" {
  bucket = google_storage_bucket.call_home_frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

#######################################
## Load balancer for frontend bucket ##
#######################################

// Following the guide here: https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket

// Enable Compute Engine API to setup an IP address
resource "google_project_service" "compute_engine_api" {
  project = data.google_project.project.project_id
  service = "compute.googleapis.com"
}

// Setup IP address for load balancer
resource "google_compute_global_address" "call_home_frontend_ip" {
  project = data.google_project.project.project_id
  name = "call-home-frontend-ip"
}

// Backend bucket with CDN policy with default ttl settings
resource "google_compute_backend_bucket" "call_home_frontend_lb" {
  name = "call-home-frontend-lb"
  description = "Load balancer for the frontend GCS bucket"
  project = data.google_project.project.project_id
  bucket_name = google_storage_bucket.call_home_frontend.name
  enable_cdn = true

  cdn_policy {
    cache_mode = "CACHE_ALL_STATIC"
    client_ttl = 3600
    default_ttl = 3600
    max_ttl = 86400
    negative_caching = true
    serve_while_stale = 86400
  }
}

// URL map for the backend bucket
resource "google_compute_url_map" "call_home_lb" {
  name = "call-home-lb"
  project = data.google_project.project.project_id
  default_service = google_compute_backend_bucket.call_home_frontend_lb.id

  depends_on = [
    google_compute_backend_bucket.call_home_frontend_lb
  ]
}

// Setup SSL certificate to enable HTTPS for load balancer
resource "google_compute_managed_ssl_certificate" "call_home_frontend_lb_ssl" {
  name = "call-home-frontend-lb-ssl"
  project = data.google_project.project.project_id

  managed {
    domains = ["app2-staging.callhome.sg"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

// HTTP proxy
resource "google_compute_target_https_proxy" "call_home_frontend_lb_proxy" {
  name = "call-home-frontend-lb-proxy"
  project = data.google_project.project.project_id
  url_map = google_compute_url_map.call_home_lb.id

  ssl_certificates = [
    google_compute_managed_ssl_certificate.call_home_frontend_lb_ssl.name
  ]

  depends_on = [
    google_compute_managed_ssl_certificate.call_home_frontend_lb_ssl,
    google_compute_url_map.call_home_lb
  ]
}

// Forwarding rule
resource "google_compute_global_forwarding_rule" "call_home_frontend_lb_forwarding" {
  name = "call-home-frontend-lb-forwarding"
  project = data.google_project.project.project_id
  ip_protocol = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range = "443"
  target = google_compute_target_https_proxy.call_home_frontend_lb_proxy.id
  ip_address = google_compute_global_address.call_home_frontend_ip.id

  depends_on = [
    google_compute_target_https_proxy.call_home_frontend_lb_proxy,
    google_compute_global_address.call_home_frontend_ip
  ]
}

#############
## Outputs ##
#############

// Output the frontend GCS bucket name
output "frontend_bucket" {
  value = google_storage_bucket.call_home_frontend.name
}
