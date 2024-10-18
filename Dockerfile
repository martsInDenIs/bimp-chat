FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN mkdir uploads

RUN npx prisma generate