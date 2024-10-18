FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

FROM lscr.io/linuxserver/calibre:latest

COPY . .

CMD ["node", "main.js"]
