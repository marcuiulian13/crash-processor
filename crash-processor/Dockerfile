FROM node:lts-alpine

WORKDIR /usr/crash-processor

COPY package.json yarn.lock .env ./

RUN yarn

COPY src/ ./src

ENTRYPOINT yarn start