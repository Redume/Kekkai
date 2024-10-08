const logger = require('../shared/logger/src/main.js');
const config = require('../shared/config/src/main.js')();
const fs = require('fs');

require('../shared/database/src/create_table.js')();

const fastify = require('fastify')({
    logger: config['server']['log']['print'] ? logger : false,
    ...(config['server']['ssl']['work']
        ? {
              https: {
                  key: fs.readFileSync(
                      config['server']['ssl']['private_key'],
                      'utf8',
                  ),
                  cert: fs.readFileSync(
                      config['server']['ssl']['cert'],
                      'utf8',
                  ),
              },
          }
        : false),
});

const getRateRoute = require('./routes/getRate.js');
const configurationRoutes = require('./routes/configuration.js');

fastify.register(getRateRoute);
fastify.register(configurationRoutes);

fastify.listen(
    {
        port: 3000,
        host: config['server']['host'] ? config['server']['host'] : 'localhost',
    },
    (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    },
);
