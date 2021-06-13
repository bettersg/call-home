#!/bin/bash

set -euox pipefail

# This script is really meant for OS X. Too lazy to make this generalize to Linux.

function buildAndDeployDocker {
    # Populate the version in the build steps
    docker build --build-arg PUBLIC_URL="${PUBLIC_URL}" --build-arg RELEASE_DATE="${VERSION}" . -t call-home

    # Push the container and start the heroku release
    docker tag call-home registry.heroku.com/${HEROKU_APP}/web

    # We prefer this method of building because ain't nobody got time for Heroku to build cleanly from our commits
    docker push registry.heroku.com/${HEROKU_APP}/web && heroku container:release web --app ${HEROKU_APP}
}

# Live source maps already work, but maybe this helps Sentry keep track of historical maps
function deploySentrySourceMaps {
    # Clean up the previous stuff if needed
    rm -r /tmp/call-home-static || true
    docker container rm temp || true

    # Create a container from the image and cp the source maps from there
    docker run --name=temp call-home /bin/true
    docker cp temp:/app/backend/static/static/js /tmp/call-home-js
    docker container rm temp

    npx @sentry/cli releases --org=ring-a-senior --project=ring-a-senior-frontend files ${VERSION} upload-sourcemaps --ext js --ext map --rewrite /tmp/call-home-js
}

# Associate the current time with the release.
# This gets injected into the frontend and is used by Sentry
VERSION=$(date +%Y-%m-%dT%H:%M:%S%z)

HEROKU_APP_STAGING=call-home-staging
HEROKU_APP_PROD=call-home

if [ "$1" = "prod" ]; then
    HEROKU_APP="${HEROKU_APP_PROD}"
    PUBLIC_URL="https://app.callhome.sg"
    buildAndDeployDocker
    deploySentrySourceMaps
else
    HEROKU_APP="${HEROKU_APP_STAGING}"
    PUBLIC_URL="https://call-home-staging.herokuapp.com"
    buildAndDeployDocker
fi
