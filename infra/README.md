# Infra

### Setting up

Ensure that you have `terraform` and `gcloud` installed locally.

Run `make gcloud-login` to login using `gcloud` if you are not logged in already.

Run `make init` to set up terraform using the remote state hosted on GCS.

In `staging/` or `production/`, configure your database username and password in `secret.tfvars`.

### Deployment

Run `make tf-apply` to deploy the GCP resources using terraform.
