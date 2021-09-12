FROM node:15

WORKDIR /app/shared

COPY package.json .
COPY package-lock.json .

RUN npm run init
RUN npm install
RUN npm run build

COPY types/ types/
