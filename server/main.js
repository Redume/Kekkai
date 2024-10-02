const logger = require('../shared/logger/src/main.js');
const config = require('../shared/config/src/main.js')();
const fs = require('fs');

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

const getChartRoute = require('./routes/getChart.js');
const getRateRoute = require('./routes/getRate.js');

fastify.register(getChartRoute);
fastify.register(getRateRoute);

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
