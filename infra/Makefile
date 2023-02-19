gcloud-login:
	gcloud auth application-default login

init:
	cd $(ENVIRONMENT) && terraform init && cp secret.tfvars.template secret.tfvars

tf-apply:
	cd $(ENVIRONMENT) && terraform apply -var-file="secret.tfvars"
