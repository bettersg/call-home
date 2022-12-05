.DEFAULT_GOAL:=help

# The default Strapi port. See comment on `dev` before running `make dev`.
PORT?=1337

# Explicitly label phonies because we have at least one non-phony (`build`).
.PHONY: dev clean args help

##@ Dev

# NOTE: This affects where the app runs, but NOT where its own routes point.
# That is configured in config/server.js, which gets baked in at build-time, not
# run-time. So to properly run on PORT in development, you have to run `build`
# before `dev`, e.g. `make PORT=4000 build && make PORT=4000 dev`.

dev: ## Run Strapi with autoReload enabled
	PORT=$(PORT) npm run develop

build: ## Build Strapi server.
	PORT=$(PORT) npm run build

clean: ## Clean out the results of a build
	rm -fr build/

##@ Deployment

##@ Helpers

args: ## Show build args
	@echo FOO=$(FOO)

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
