const logger = require('../shared/logger/src/main.js');
const config = require('../shared/config/src/main.js')();

const fs = require('fs');
const axios= require("axios");
const UAParser = require('ua-parser-js');

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
const HomeRoute = require('./routes/home.js');

fastify.register(getRateRoute);
fastify.register(configurationRoutes);
fastify.register(HomeRoute);

fastify.addHook('onResponse', async (request, reply) => {
    const routePart = request.raw.url.split('/')
    const routePartFiltered = routePart
                                    .filter(part => part !== '')
                                    .map(part => `${part}/`);

    routePartFiltered.unshift('/');

    if (!config?.['analytics']['work'] ? config?.['analytics']['work'] : false) return;
    else if (!fastify.printRoutes().includes(routePartFiltered.at(-1))) return;

    const userAgent = request.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const formattedOS = (os.name && os.version) ? `${os.name} ${os.version}` : 'N/A';
    const formattedBrowser = (browser.name && browser.version) ? `${browser.name} ${browser.version}` : 'N/A';

    const event = {
      domain: config['analytics']['plausible_domain'],
      name: request.routeOptions.url ? request.routeOptions.url : '404 - Not Found',
      url: request.raw.url,
      props: {
          method: request.method,
          statusCode: reply.statusCode,
          browser: formattedBrowser,
          os: formattedOS,
          source: request.headers['referer'] ? request.headers['referer'] : 'direct',
      },
    };

    try {
        await axios.post(config['analytics']['plausible_api'], event, {
            headers: {
                Authorization: `Bearer ${config['analytics']['plausible_token']}`,
                'Content-Type': 'application/json',
                'User-Agent': userAgent,
        },
      });
    } catch (error) {
      fastify.log.error('Error sending event to Plausible:', error.message);
    }
});

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
