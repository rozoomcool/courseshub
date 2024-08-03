FROM node:22-alpine3.19
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
# COPY prisma ./prisma/

RUN npm run prisma:generate
# RUN npm run prisma:migrate

EXPOSE 3000