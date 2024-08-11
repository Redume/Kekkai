const pino = require('pino');
const pretty = require('pino-pretty');
const config = require('../config/main.js')();

const logger = pino({
    level: config['server']['debug'] ? 'debug' : 'info',
    }, pretty());

module.exports = logger;