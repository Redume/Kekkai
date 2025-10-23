FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN mkdir -p /doc

RUN if [ -d "./dist" ]; then cp -r ./dist/* /doc/; fi
RUN if [ -d "./build" ]; then cp -r ./build/* /doc/; fi

CMD ["sh", "-c", "ls -la /doc"]
