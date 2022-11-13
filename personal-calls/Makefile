ENVIRONMENT?=staging
DEPLOY_TARGET?=heroku

# Associate the current time with the release.
# This gets injected into the frontend and is used by Sentry
VERSION=$(shell date +%Y-%m-%dT%H:%M:%S%z)

HEROKU_APP_staging:=call-home-staging
HEROKU_APP_prod:=call-home
HEROKU_APP_TARGET:=$(HEROKU_APP_$(ENVIRONMENT))

PUBLIC_URL_staging=https://call-home-staging.herokuapp.com
PUBLIC_URL_prod=https://app.callhome.sg
PUBLIC_URL_TARGET:=$(PUBLIC_URL_$(ENVIRONMENT))

CLOUDRUN_REPO:=gcr.io/call-home-320615/call-home

APPS:=frontend backend

.DEFAULT_GOAL:=help

##@ Dev

init: ## Setup repo, and npm ci
	cd shared && npm run init && npm ci
	$(MAKE) init-apps

init-apps: $(APPS:%=%.init)

$(APPS:%=%.init): %.init:
	cd $* && npm run init && npm ci

precommit: $(APPS:%=%.precommit) ## Run precommit checks

$(APPS:%=%.precommit): %.precommit:
	cd $* && npm run precommit

build: ## Build for dev
	docker build . -t call-home

##@ Deployment

build-deployment: ## Build for deployment
	@echo "Building app..."
	docker build --build-arg PUBLIC_URL="$(PUBLIC_URL_TARGET)" --build-arg RELEASE_DATE="$(VERSION)" -t call-home .

heroku-login: ## Login to heroku
	heroku login
	heroku container:login

deploy: build-deployment ## Deploy app to cloud
ifeq ($(DEPLOY_TARGET),heroku)
	@echo "Deploying to Heroku..."
	$(MAKE) deploy-heroku
else ifeq ($(DEPLOY_TARGET),cloudrun)
	@echo "Deploying to Cloud Run..."
	$(MAKE) deploy-cloudrun
endif
	deploy-sentry

deploy-heroku: ## Deploy to heroku
	docker tag call-home registry.heroku.com/$(HEROKU_APP_TARGET)/web
	docker push registry.heroku.com/$(HEROKU_APP_TARGET)/web
	heroku container:release web --app $(HEROKU_APP_TARGET)

deploy-cloudrun: ## Deploy to cloudrun
	docker tag call-home $(CLOUDRUN_REPO)
	docker push $(CLOUDRUN_REPO)
	gcloud config set run/region asia-east1
	gcloud run deploy call-home --image=$(CLOUDRUN_REPO):latest

deploy-sentry: ## Deploy Sentry source maps
# Clean up the previous stuff if needed
	rm -r /tmp/call-home-static || true
	docker container rm temp || true

# Create a container from the image and cp the source maps from there
	docker run --name=temp call-home /bin/true
	docker cp temp:/app/backend/static/static/js /tmp/call-home-js
	docker container rm temp

	npx @sentry/cli releases --org=ring-a-senior --project=ring-a-senior-frontend files $(VERSION) upload-sourcemaps --ext js --ext map --rewrite /tmp/call-home-js

##@ Helpers

args: ## Show build args
	@echo ENVIRONMENT=$(ENVIRONMENT)
	@echo VERSION=$(VERSION)
	@echo HEROKU_APP_TARGET=$(HEROKU_APP_TARGET)
	@echo PUBLIC_URL_TARGET=$(PUBLIC_URL_TARGET)

check: ## Check if project dependencies are installed
	@which npm || (echo "Please install npm" && exit 1)
	@which heroku || (echo "Please install heroku cli" && exit 1)
	@which docker || (echo "Please install docker" && exit 1)

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
