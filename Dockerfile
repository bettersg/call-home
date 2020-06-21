# frontend
FROM node:12 AS frontend
WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

COPY frontend/src/ src/
COPY frontend/public/ public/

ENV NODE_ENV=production
RUN npm run build

# backend
FROM node:12
WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install

COPY backend/src/ src/

# Copy migration files over
COPY backend/.sequelizerc .
COPY backend/sequelize sequelize/

# Set the static directory for the backend
ENV STATIC_DIR=static
COPY --from=frontend /app/frontend/build $STATIC_DIR

WORKDIR /app/backend
CMD npm start
