.DEFAULT_GOAL:=help

##@ Dev
init: ## Install the project
	npm ci

dev: ## Run the frontend in development mode
	npm start

copy-common: ## Copy common files from the personal-calls common directory
	rm -rf src/common
	cp -r ../../personal-calls/frontend/src/common src/

##@ Deployment

##@ Helpers

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
