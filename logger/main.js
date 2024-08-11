const pino = require('pino');
const pretty = require('pino-pretty');
const config = require('../config/main.js')();

const logger = pino({
    level: config['server']['log']['level'] ? config['server']['log']['level'] : null,
    }, pretty());

module.exports = logger;