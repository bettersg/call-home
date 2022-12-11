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

######################
## Project Settings ##
######################

data "google_project" "project" {
  project_id = var.project_id
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
