FROM node:18-alpine

WORKDIR /api

COPY yarn.lock package*.json .env ./

RUN yarn install --frozen-lockfile

COPY . .

ENV PORT=3000

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start:prod" ]