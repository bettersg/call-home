# frontend
FROM node:12 AS frontend

ARG RELEASE_DATE

WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

COPY frontend/src/ src/
COPY frontend/public/ public/

ENV NODE_ENV=production
ENV REACT_APP_RELEASE_DATE=${RELEASE_DATE}

RUN npm run build

# backend
FROM node:12 AS backend
WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install

COPY backend/tsconfig.json .
COPY backend/src/ src/

# Copy migration files over
COPY backend/.sequelizerc .
COPY backend/sequelize sequelize/

RUN npm run build

# Set the static directory for the backend
ENV STATIC_DIR=static
COPY --from=frontend /app/frontend/build $STATIC_DIR

CMD npm start
