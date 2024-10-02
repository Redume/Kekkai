const config = require('../../shared/config/src/main.js')();
const chart = require('../../chart/chart.js');

module.exports = async function GetChartRoute(fastify) {
    fastify.get('/api/getChart/', async function (req, res) {
        const query = req.query;
        if (!query['from_currency'] || !query['conv_currency']) {
            return res.status(400).send({
                status: 400,
                message: 'The from_currency and conv_currency fields are required',
            });
        }
        if (!query['start_date'] || !query['end_date'])
            return res.status(400).send({
                status: 400,
                message: 'start_date and end_date is required',
            });

        const charts = await chart.gen_chart(
            query['from_currency'],
            query['conv_currency'],
            query['start_date'],
            query['end_date'],
        );

        if (config['currency']['chart']['save'])
            chart.save_chart(
                charts,
                `${query['from_currency']} ${query['conv_currency']} ` +
                `(${query['start_date']} - ${query['end_date']}).png`,
            );

        return res.status(200).send({
            status: 200,
            message: charts,
        });
    });
}