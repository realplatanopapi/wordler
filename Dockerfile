FROM node:16.13-slim

ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}

WORKDIR /usr/src/app

RUN apt-get update && \
  apt-get install -y \
  libssl-dev

COPY package.json yarn.lock ./
RUN yarn install --production=false

COPY . .
RUN yarn build && yarn install

CMD ["yarn", "start"]

EXPOSE 3000 9229
