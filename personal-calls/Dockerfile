# Prepare shared code in a base image
FROM node:16 AS base

WORKDIR /app/shared

COPY shared/package.json shared/package-lock.json shared/tsconfig.json ./

RUN npm run init
RUN npm install
COPY shared/types/ types/

RUN npm run build

# frontend
FROM base AS frontend

WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm run init
RUN npm install

COPY frontend/tsconfig.json .
COPY frontend/src/ src/
COPY frontend/public/ public/

ENV NODE_ENV=production
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
# Disable the create-react-app preflight check because it complains about eslint
# but we don't care
ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

# backend
FROM base
WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm run init
RUN npm install

COPY backend/tsconfig.json .
COPY backend/src/ src/

RUN npm run build

# Set the static directory for the backend
ENV STATIC_DIR=static
COPY --from=frontend /app/frontend/build $STATIC_DIR

ARG RELEASE_DATE
ENV RELEASE_DATE=${RELEASE_DATE}
RUN echo "window.CALL_HOME = {RELEASE_DATE: '${RELEASE_DATE}'}" > $STATIC_DIR/release-version.js

CMD npm start
