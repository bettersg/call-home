#!/bin/bash

set -euox pipefail

# This script is really meant for OS X. Too lazy to make this generalize to Linux.

# Docker building stuff
# =================================================================

# Associate the current time with the release.
# This gets injected into the frontend and is used by Sentry
VERSION=$(date +%Y-%m-%dT%H:%M:%S%z)

# Populate the version in the build steps
docker build --build-arg RELEASE_DATE=${VERSION} . -t call-home

# Push the container and start the heroku release
docker tag call-home registry.heroku.com/call-home/web

# We prefer this method of building because ain't nobody got time for Heroku to build cleanly from our commits
docker push registry.heroku.com/call-home/web && heroku container:release web

# Sentry stuff
# This seems unnecessary because source maps seem to already work
# =================================================================

# Clean up the previous stuff if needed
# rm -r /tmp/call-home-static || true
# docker container rm temp || true

# # Create a container from the image and cp the source maps from there
# docker run --name=temp call-home /bin/true
# docker cp temp:/app/backend/static/static/js /tmp/call-home-js
# docker container rm temp

# npx sentry-cli releases --org=ring-a-senior --project=ring-a-senior-frontend files ${VERSION} upload-sourcemaps --ext js --ext map --rewrite /tmp/call-home-js
