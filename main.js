const schedule = require('node-schedule');
const yaml = require("yaml")
const fs = require("fs");
const path = require('path');
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));
const Currency = require('./dao/Currency.js')

let config_https = {}
if (config['server']['ssl']['enabled']) {
    config_https = {
        https: {
            key: fs.readFileSync(path.join(__dirname, config['server']['ssl']['privatekey'])),
            cert: fs.readFileSync(path.join(__dirname, config['server']['ssl']['cert'])),
        }
    }
}

const fastify = require('fastify')({
    logger: config['server']['logger'],
    config_https
})

const saveRate = require('./utils/saveRate.js');
const response = require('./utils/errorResponse');

saveRate();
schedule.scheduleJob('30 8 * * *', async function () {
    await saveRate();
});

fastify.get('/api/v1/rate/', async function (req) {
    if (!req.query?.typeGetRate) return response(
        'error',
        400,
        'Specify the type of currency. Two types are available, fiat or cryptocurrency'
    );
    else if (req.query?.typeGetRate !== 'fiat' &&
            req.query?.typeGetRate !== 'crypto') return response(
                'error', 
                400,
                'Specify the correct currency type. There are two types available, fiat or cryptocurrency'
    );

    if (!req.query?.fromCurrency || !req.query?.convCurrency) return response(
        'error',
        400,
        'fromCurrency and convCurrency parameter is required'
    );

    const currency = new Currency(req.query.typeGetRate,
                                        req.query.fromCurrency,
                                        req.query.convCurrency,
                                        req.query.periodStart,
                                        req.query.periodEnd);

    if (!Object.keys(await currency.getData()).length) return response(
        'error',
        500,
        'There is no data for this time'
    );

    return await currency.getData();
});

fastify.listen({
    host: config.server.host,
    port: config.server.port,
}, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})
