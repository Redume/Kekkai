const fastify = require('fastify')({logger: true})
const rate = require('../database/main.js');

fastify.get('/api/getRate/', async function (req, res){
    const query = req.query;
    if (!query['fromCurrency'] || !query['convCurrency']) return;

    if (query['date']) return rate.getDay(query['fromCurrency'], query['convCurrency'], query['date']);
    else if (query['startDate'] && query['endDate']) return rate.getPeriod(
        query['fromCurrency'],
        query['convCurrency'],
        query['startDate'],
        query['endDate']
    );
    else return;
});

fastify.listen({ port: 3000 }, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});