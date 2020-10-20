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
## Bypass Auth0 Login

Authentication is dependent on auth0's SMS verification which does not work easily on localhost.

Set environment variables below in `.env` file to enable instant admin login access.

```bash
BYPASS_AUTH0_LOGIN=yes
DEV_USER_PHONE_NUMBER=+6588888888
```

## Development using Twilio Voice

Twilio requires a public URL to confirm calls via webhook. The webhook URL can be set up with https://ngrok.com/ for now.

In Twilio's console, update the REQUEST URL with your ngrok `https` url.
`Voice / TwiML / TwiML Apps / Dev backend > REQUEST URL`

Note that this method only works for one developer at a time.
