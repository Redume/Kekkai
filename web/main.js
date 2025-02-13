const logger = require("../shared/logger");
const config = require("../shared/config/src/main.js")();

const fs = require("fs");
const path = require("node:path");

const fastify = require("fastify")({
    logger: config["server"]["log"]["print"] ? logger : false,
    ...(config["server"]["ssl"]["work"]
        ? {
            https: {
                key: fs.readFileSync(config["server"]["ssl"]["private_key"], "utf8"),
                cert: fs.readFileSync(config["server"]["ssl"]["cert"], "utf8"),
            },
        }
        : false),
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'src/static'),
    prefix: '/static/',
});

fastify.register(require('./routes/home.js'));


fastify.listen(
    {
        port: 3050,
        host: config["server"]["host"] ? config["server"]["host"] : "localhost",
    },
    (err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    },
);
