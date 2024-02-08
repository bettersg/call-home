ENVIRONMENT?=staging

gcloud-login:
	gcloud auth application-default login

init:
	cd $(ENVIRONMENT) && terraform init

tf-apply:
	cd $(ENVIRONMENT) && terraform apply
