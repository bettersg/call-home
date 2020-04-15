FROM node:12

# backend
WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install

COPY backend/src/ src/
COPY backend/setupDemo.js .

# frontend
WORKDIR /app/frontend

COPY frontend/package.json .
COPY frontend/package-lock.json .

RUN npm install

COPY frontend/src/ src/
COPY frontend/public/ public/

RUN npm run build

# Set the static directory for the backend
ENV STATIC_DIR=static
RUN cp -r build ../backend/$STATIC_DIR

WORKDIR /app/backend
CMD npm start
