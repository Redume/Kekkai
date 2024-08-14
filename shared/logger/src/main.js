const pino = require('pino');
const pretty = require('pino-pretty');
const path = require('path');
const config = require('../../config/src/main.js')();

function getCallerFile() {
    const originalFunc = Error.prepareStackTrace;

    let callerFile;
    try {
        const err = new Error();
        let currentFile;

        Error.prepareStackTrace = function (err, stack) { return stack; };
        currentFile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerFile = err.stack.shift().getFileName();
            if (currentFile !== callerFile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc;

    return callerFile ? path.basename(callerFile) : 'unknown';
}

const logger = pino({
    level: config['server']['log']['level'] ?  config['server']['log']['level'] : 'info',
    prettifier: pretty,
    prettify: true,
    messageKey: 'msg',
    timestampKey: 'time',
}, pretty({
    ignore: 'pid,hostname',
    messageFormat: '{msg}',
}));

function wrapLogger(logger) {
    const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

    const wrappedLogger = {};

    levels.forEach(level => {
        wrappedLogger[level] = function (msg, ...args) {
            const callerFile = getCallerFile();
            const msgWithFilename = `[${callerFile}] ${msg}`;

            logger[level](msgWithFilename, ...args);
        };
    });

    wrappedLogger.child = logger.child.bind(logger);

    return wrappedLogger;
}

module.exports = wrapLogger(logger);
