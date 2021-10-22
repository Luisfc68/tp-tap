FROM node:16.12-bullseye

WORKDIR /home/node/app

COPY src package.json package-lock.json tsconfig.json ./

RUN npm install

CMD npm run start