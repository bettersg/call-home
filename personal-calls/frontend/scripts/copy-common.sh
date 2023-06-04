#!/usr/bin/env sh

set -eu

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
APPS_COMMON_DIR="${PROJECT_ROOT}/apps/common"
OWN_COMMON_DIR="src/common"

echo "Copying common code from ${APPS_COMMON_DIR} to ${PWD}/${OWN_COMMON_DIR}"

rm -fr "$OWN_COMMON_DIR"
cp -r "$APPS_COMMON_DIR" "$OWN_COMMON_DIR"
