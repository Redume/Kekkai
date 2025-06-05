FROM node:20-alpine AS shared-config
# Install shared/config dependencies
WORKDIR /
COPY ./shared/config/package*.json .
RUN npm install

FROM node:20-alpine AS shared-database
# Install shared/database dependencies
WORKDIR /
COPY ./shared/database/package*.json .
RUN npm install

FROM node:20-alpine AS shared-logger
# Install the shared/logger dependencies
WORKDIR /
COPY ./shared/logger/package*.json .
RUN npm install

FROM node:20-alpine AS parser

WORKDIR /

# Install parser dependencies
COPY ./parser/package*.json ./
RUN npm install

# Copying shared dependencies
COPY --from=shared-config /node_modules /node_modules
COPY --from=shared-database /node_modules /node_modules
COPY --from=shared-logger /node_modules /node_modules

# Copy all the other files
COPY ./parser/ ./
COPY shared /shared

CMD ["node", "main.js"]