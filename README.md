# callhome.sg

This is very much in the MVP stage.

## What does it do?

- Call a user-specified number
- Save user preferences to the DB

## How to run

### Setup

- [TypeScript](https://www.npmjs.com/package/typescript)
- node 12 (preferably installed with versioning tool such as [Node Version Manager](https://github.com/nvm-sh/nvm))
- [Docker and docker-compose](https://docs.docker.com/get-docker/), if you want to use the docker method
- A `backend/.env` file, taking reference from `backend/.env.sample`

Backend runs on port `4000` while Frontend runs on port `3000` and can be run using the instructions below.

### Quick Start

- Get a working copy of `.env`
- Start Backend:

```bash
cd backend
npm i
npm run start:dev
```

- Seed database with your phone number (must be real number as SMS is used for logging in)

```
-- For SQLITE
INSERT INTO AllowlistEntries("phoneNumber", "role", "destinationCountry","createdAt", "updatedAt")
VALUES ('+65YOURNUMBER', 'ADMIN', 'SG', date('now'), date('now'));

-- For POSTGRES
INSERT INTO AllowlistEntries("phoneNumber", "role", "destinationCountry","createdAt", "updatedAt")
VALUES ('+65YOURNUMBER', 'ADMIN', 'SG', NOW(), NOW());
```

- Start Frontend:

```bash
cd frontend
npm i
npm start
```

- On your browser, go to http://localhost:4000.

### Server

#### npm script

```bash
cd backend
npm run start:dev
```

#### Docker

This app is built and run with docker.

```sh
# build the image
docker build . -t call-home

# run the image
docker run -it call-home
```

#### docker-compose

Or more conveniently with docker-compose from repository root.

```bash
# To include new docker image build
docker-compose up --build

# To use existing docker image
docker-compose up
```

If you have conflicting ports, you can select the port for access via localhost in `docker-compose.yml`.

Just change the `ports` configuration.

```bash
# docker-compose.yml
...
    ports:
      - DESIRED_PORT:DONT_CHANGE_THIS
...
```


### Frontend

```bash
cd frontend
npm start
```

### Note about backend-frontend proxy

Take note that even though the frontend React server is available via http://localhost:3000, you should be entering the React app via http://localhost:4000 instead.

This is because the backend (:4000) proxies to the frontend server (:3000) and is required for Facebook login to work.

Specifically, the request to GET '/oauth/login' does not work when using React server (:3000)

## Development using Twilio Voice

Twilio requires a public URL to confirm calls via webhook. The webhook URL can be set up with https://ngrok.com/ for now.

In Twilio's console, update the REQUEST URL with your ngrok `https` url.
`Voice / TwiML / TwiML Apps / Dev backend > REQUEST URL`

Note that this method only works for one developer at a time.
