FROM node:lts-alpine

WORKDIR /usr/src/app

COPY client/ ./

RUN npm install

COPY . .

CMD npm start

EXPOSE 8080