.DEFAULT_GOAL:=help
ENVIRONMENT?=staging
ENVIRONMENT_FILE?=$$(git rev-parse --show-toplevel)/.env.${ENVIRONMENT}

##@ Dev
init: ## Install the project
	npm ci

clean: ## Delete build artifacts
	rm -rf build/

dev: ## Run the frontend in development mode
	npm start

format: ## Format JS code nicely. Run this before committing.
	npm run format

lint: ## Check JS for linting errors. Run this before committing.
	npm run lint
	npm run format:check

copy-common: ## Copy common files from the personal-calls common directory
	rm -rf src/common
	cp -r ../../personal-calls/frontend/src/common src/

##@ Deployment
build: ## Create a directory with the production build
	npm run build

deploy: ## Deploy the build directory to a GCS bucket
# Note that gsutil rsync may require a version of python with crcmod
# If you are running with the system python, this should be fixable with
#   pip3 install crcmod
	sh -ac '. ${ENVIRONMENT_FILE}; gsutil rsync -d -r build/ gs://$${FRONTEND_BUCKET}'

##@ Helpers

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
