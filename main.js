const fastify = require('fastify')({ logger: true });
const schedule = require('node-schedule');
const pool = require("./postgresql.js");
const yaml = require("yaml")
const fs = require("fs");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

const saveRate = require('./utils/saveRate.js');
const response = require('./utils/errorResponse');

schedule.scheduleJob('30 8 * * *', async function () {
    console.log('I save the currency data');
    await saveRate();
});

fastify.get('/api/getRate/', async function (req, reply) {
    if (!req['query']?.['codeCurrency']) return response(
        400,
        'error',
        'codeCurrency parameter is required'
        );

    if (!req['query']?.['periodStart']) return response(
        400,
        'error',
        'periodStart parameter is required'
    );

    let data = await pool.query('SELECT * FROM currency WHERE from_currency = $1 AND date = $2', [
        req['query']['codeCurrency'],
        req['query']['periodStart'],
    ]).then(response('error', 500, 'Internal Server Error'));

    if (!data['rows']?.[0]) return response(
        'error',
        204,
        'There is no data for this time'
    );

    if (req['query']?.['periodEnd']) {
        let data = await pool.query('SELECT * FROM currency WHERE (date BETWEEN $2 AND $3) AND from_currency = $1', [
            req['query']['codeCurrency'],
            req['query']['periodStart'],
            req['query']['periodEnd'],
        ]);

        return data['rows'];
    }

    return data['rows'];
});

fastify.listen({
    host: config['server']['host'],
    port: config['server']['port']
}, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})
