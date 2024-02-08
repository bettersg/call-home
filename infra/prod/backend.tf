
terraform {
  backend "gcs" {
    bucket = "call-home-prod-terraform-state-bucket"
    prefix = "terraform/state"
  }
}
