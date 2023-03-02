# Call Home

## Migrant worker services

- Personal Calls, aka "legacy" Call Home
- Support services (WIP)

### Development

Each logical module should have both a `Makefile` in its root.
Any development scripts you need to run can be found there.

To learn about the scripts, you can run `make` with no args, which will parse
the `Makefile` and give nicely formatted help output, e.g.:

```
Usage:
  make

Dev
  init             Setup repo, and npm ci
  precommit        Run precommit checks
  build            Build for dev

Deployment
  build-deployment  Build for deployment
  heroku-login     Login to heroku
  deploy           Deploy app to cloud
  deploy-heroku    Deploy to heroku
  deploy-cloudrun  Deploy to cloudrun
  deploy-sentry    Deploy Sentry source maps

Helpers
  args             Show build args
  check            Check if project dependencies are installed
```
