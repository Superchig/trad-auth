VERSION 0.6
FROM node:19.7.0-bullseye
WORKDIR /app

check:
    COPY . .
    RUN cp .env.template .env
    RUN npm install
    RUN npm run check

build:
    COPY . .
    RUN npm install
    # NOTE(Chris): Due to SvelteKit's environment variable API, we need these 2
    # environmental variables to exist at build time.
    # We will set them when actually running the build.
    ARG DATABASE_URL
    ARG BASIC_AUTH_LOGIN
    RUN npm run build
    SAVE ARTIFACT . /dist

docker:
    COPY +build/dist dist
    CMD ["node", "./dist/build"]
    SAVE IMAGE trad-auth:latest
