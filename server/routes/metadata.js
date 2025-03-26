const pool = require('../../shared/database/src/postgresql.js');
const config = require('../../shared/config/src/main.js')();

module.exports = async function metadata(fastify) {
    fastify.get('/api/metadata/', async function (req, res) {
        const first_date = await pool.query(
            'SELECT * FROM currency ORDER BY date LIMIT 1',
        );
        const last_date = await pool.query(
            'SELECT * FROM currency ORDER BY date DESC LIMIT 1',
        );

        return res.status(200).send({
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            first_date: first_date.rows[0]?.date
                ? first_date.rows[0]?.date
                : 'None',
            last_date: last_date.rows[0]?.date
                ? last_date.rows[0]?.date
                : 'None',
            currencies: {
                crypto: config['currency']['crypto'],
                fiat: config['currency']['fiat'],
            },
        });
    });
};
