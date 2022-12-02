terraform {
  backend "gcs" {
    bucket = "call-home-staging-terraform-state-bucket"
    prefix = "terraform/state"
  }
}
