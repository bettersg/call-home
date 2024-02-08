# Infra

### Setting up

Ensure that you have `terraform` and `gcloud` installed locally.

Run `make gcloud-login` to login using `gcloud` if you are not logged in already.

### Using Terraform

Configure whether you're deploying to staging or production by setting the
`ENVIRONMENT` env variable to either `staging` (default) or `prod`.

Run `make init` to set up terraform using the remote state hosted on GCS.

### Deployment

Run `make tf-apply` to deploy the GCP resources using terraform.