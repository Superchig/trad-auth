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
    RUN npm run build
    SAVE ARTIFACT build /dist/build

docker:
    COPY +build/dist dist
    ENTRYPOINT ["node", "./dist/build"]
    SAVE IMAGE trad-auth:latest
