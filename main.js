const schedule = require('node-schedule');
const pool = require("./postgresql.js");
const yaml = require("yaml")
const fs = require("fs");
const path = require('path');
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

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

//saveRate();
schedule.scheduleJob('30 8 * * *', async function () {
    console.log('I save the currency data');
    await saveRate();
});

fastify.get('/api/v1/rate/', async function (req) {
    if (!req['query']?.['typeGetRate']) return response(
        'error',
        400,
        'Specify the type of currency. Two types are available, fiat or cryptocurrency'
    );
    else if (req['query']?.['typeGetRate'] !== 'fiat' &&
            req['query']?.['typeGetRate'] !== 'crypto') return response(
                'error', 
                400,
                'Specify the correct currency type. There are two types available, fiat or cryptocurrency'
    );

    let data = await pool.query(`SELECT * FROM ${req['query']['typeGetRate']} WHERE from_currency = $1 AND
            conv_currency = $2 AND
            date = $3`,
    [
        req['query']['fromCurrency'],
        req['query']['convCurrency'],
        req['query']['periodStart'],
    ]
    );

    if (!data['rows']?.[0]) return response(
        'error',
        400, 
        'periodStart parameter is required'
    );

    if (req['query']?.['periodEnd']) {
        let data = await pool.query(`SELECT * FROM ${req['query']['typeGetRate']} WHERE 
                    (date BETWEEN $4 AND $5) 
                      AND from_currency = $2 
                      AND conv_currency = $3`,
            [
            req['query']['fromCurrency'],
            req['query']['convCurrency'],
            req['query']['periodStart'],
            req['query']['periodEnd'],
        ]);

        return data['rows'];
    }

    return data['rows'][0];
});

fastify.listen({
    host: config['server']['host'],
    port: config['server']['port'],
}, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})
