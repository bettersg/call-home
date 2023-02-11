ENVIRONMENT?=staging

FRONTEND_SRC?=../apps/super-app
FRONTEND_BUILD_FOLDER?=build
TF_VAR_frontend_bucket_name?=call-home-frontend

gcloud-login:
	cd $(ENVIRONMENT) && gcloud auth application-default login

init:
	cd $(ENVIRONMENT) && terraform init && cp secret.tfvars.template secret.tfvars

tf-apply:
	cd $(ENVIRONMENT) && terraform apply -var-file="secret.tfvars"
	
frontend-deploy:
	cd $(FRONTEND_SRC) && npm run build && gsutil cp -r $(FRONTEND_BUILD_FOLDER)/* gs://$(TF_VAR_frontend_bucket_name)
