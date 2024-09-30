# Use source files to build the app
FROM node:18 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
