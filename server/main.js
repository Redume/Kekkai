const logger = require('../shared/logger/src/main.js');
const config = require('../shared/config/src/main.js')();
const fs = require('fs');

const fastify = require('fastify')({
    logger: config['server']['log']['print'] ? logger : false,
    ...config['server']['ssl']['work'] ? {
        https: {
            key: fs.readFileSync(config['server']['ssl']['private_key'], 'utf8'),
            cert: fs.readFileSync(config['server']['ssl']['cert'], 'utf8'),
        }
    } : false
});

const rate = require('../shared/database/src/main.js');
const chart = require('../chart/chart.js');

fastify.get('/api/getRate/', async function (req, res){
    const query = req.query;
    if (!query['from_currency'] || !query['conv_currency']) {
        return res.status(400).send({
            status: 400,
            message: 'The from_currency and conv_currency fields are required'
        });
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

fastify.get('/api/getChart/', async function (req, res){
    const query = req.query;
    if (!query['from_currency'] || !query['conv_currency']) {
        return res.status(400).send({
            status: 400,
            message: 'The from_currency and conv_currency fields are required',
        });
    }
    if (!query['start_date'] || !query['end_date']) return res.status(400).send({
        status: 400,
        message: 'start_date and end_date is required',
    });

    const charts = await chart.gen_chart(
        query['from_currency'],
        query['conv_currency'],
        query['start_date'],
        query['end_date'],
    );

    if (config['currency']['chart']['save']) chart.save_chart(
        charts,
        `${query['from_currency']} ${query['conv_currency']} ` +
        `(${query['start_date']} - ${query['end_date']}).png`
    );

    return res.status(200).send({
        status: 200,
        message: charts,
    });
});

fastify.listen({
        port: 3000,
        host: config['server']['host'] ? config['server']['host'] : 'localhost',
    }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});