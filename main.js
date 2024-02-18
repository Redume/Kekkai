const fastify = require('fastify')({ logger: true });
const schedule = require('node-schedule');
const pool = require("./postgresql.js");
const saveRate = require('./utils/saveRate.js');
const response = require('./utils/errorResponse');


schedule.scheduleJob('30 8 * * *', async function () {
    console.log('I save the currency data');
    await saveRate();
});

fastify.get('/api/getRate/', async function (req, reply) {
    if (!req.query?.codeCurrency) return response(
        400,
        'error',
        'codeCurrency parameter is required'
        );

    if (!req.query?.periodStart) return response(400, 'error', 'period parameter is required');

    const data = await pool.query('SELECT * FROM currency WHERE from_currency = $1 AND date = $2', [
        req.query.codeCurrency,
        req.query.periodStart
    ]).then(response('error', 500, 'Internal Server Error'));

    console.log(typeof data['rows'])

    return data['rows'];
});

fastify.listen({ port: 3000 }, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})