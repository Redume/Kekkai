const logger = require('../logger/main.js');
const fastify = require('fastify')({logger: logger});
const rate = require('../database/main.js');

fastify.get('/api/getRate/', async function (req, res){
    const query = req.query;
    if (!query['from_currency'] || !query['conv_currency']) {
        return res.status(400).send({
            status: 400,
            message: 'The from_currency and conv_currency fields are required'
        })
    }


    if (query['date']) return rate.getDay(query['from_currency'], query['conv_currency'], query['date']);
    else if (query['start_date'] && query['end_date']) return rate.getPeriod(
        query['from_currency'],
        query['conv_currency'],
        query['start_date'],
        query['end_date']
    );
    else return res.status(400).send({
            status: 400,
            message: 'The date or period field is incorrect. ' +
            'There must be fields \'date\' or \'start_date\' and \'end_date\'. ' +
            'Read more in the documentation'
        });
});

fastify.listen({ port: 3000 }, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});