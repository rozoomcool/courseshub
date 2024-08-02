FROM node:22-alpine3.19
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
# COPY prisma ./prisma/

# RUN npx prisma migrate dev

EXPOSE 3000