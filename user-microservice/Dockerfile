FROM node:20.18-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm ci --ignore-scripts

COPY . /app/

RUN mkdir -p /app/dist && chown -R node:node /app

EXPOSE 3002

USER node

CMD [ "npm", "start" ]