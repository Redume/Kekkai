const logger = require('../shared/logger');
const config = require('../shared/config/src/main.js')();

const path = require('node:path');

const fastify = require('fastify')({
    logger: config['server']['log']['level'] !== 'none' ? logger : false,
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'src/static'),
    prefix: '/static/',
});

fastify.register(require('./routes/home.js'));

fastify.listen(
    {
        port: 3050,
        host: config['server']['host'] ? config['server']['host'] : 'localhost',
    },
    (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    },
);
