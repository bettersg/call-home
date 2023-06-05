#!/usr/bin/env sh

set -eu

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
APPS_COMMON_DIR="${PROJECT_ROOT}/apps/common"

PERSONAL_CALLS_COMMON_DIR="${PROJECT_ROOT}/personal-calls/frontend/src/common"
echo "Copying common code from ${APPS_COMMON_DIR} to ${PERSONAL_CALLS_COMMON_DIR}"
rm -fr "$PERSONAL_CALLS_COMMON_DIR"
cp -r "$APPS_COMMON_DIR" "$PERSONAL_CALLS_COMMON_DIR"

SUPER_APP_COMMON_DIR="${PROJECT_ROOT}/apps/super-app/src/common"
echo "Copying common code from ${APPS_COMMON_DIR} to ${SUPER_APP_COMMON_DIR}"
rm -fr "$SUPER_APP_COMMON_DIR"
cp -r "$APPS_COMMON_DIR" "$SUPER_APP_COMMON_DIR"
