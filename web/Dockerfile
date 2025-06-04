FROM node:20-alpine AS shared-config
# Install shared/config dependencies
WORKDIR /
COPY ./shared/config/package*.json .
RUN npm install

FROM node:20-alpine AS shared-logger
# Install the shared/logger dependencies
WORKDIR /
COPY ./shared/logger/package*.json .
RUN npm install

FROM node:20-alpine AS web

WORKDIR /

# Install web dependencies
COPY ./web/package*.json ./
RUN npm install

# Copying shared dependencies, without database
COPY --from=shared-config /node_modules /node_modules
COPY --from=shared-logger /node_modules /node_modules

# Copy all the other files
COPY ./web/ ./
COPY ./shared/ ./shared/

EXPOSE 3050

CMD ["node", "main.js"]