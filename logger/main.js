const pino = require('pino');

const logger = pino({
    messageKey: 'message',
    formatters: {
        level (logLevelString) {
            return { severity: logLevelString }
        }
    }
});

module.exports = logger;