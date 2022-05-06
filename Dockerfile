FROM node:16.15-alpine3.14
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --only=prod