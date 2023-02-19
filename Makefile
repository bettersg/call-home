FRONTEND_BUILD_FOLDER?=apps/super-app/build

frontend-deploy:
	gsutil cp -r $(FRONTEND_BUILD_FOLDER)/* gs://$(TF_VAR_frontend_bucket_name)