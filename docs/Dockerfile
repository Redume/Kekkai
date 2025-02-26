FROM node:20-alpine

WORKDIR /

COPY ./package*.json .

RUN npm install

CMD ["npm", "run", "build"]
