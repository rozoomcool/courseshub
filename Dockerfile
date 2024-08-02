FROM node:22-alpine3.19
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .

