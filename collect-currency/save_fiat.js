const pool = require('../shared/database/src/postgresql.js');
const axios = require('axios');
const config = require('../shared/config/src/main.js')();
const logger = require('../shared/logger/src/main.js');

async function save_fiat() {
    if (!config['currency']['collecting']['fiat']) return;

    config['currency']['fiat'].forEach((value) =>
        config['currency']['fiat'].forEach(async (pair) => {
            if (value === pair) return;

            await axios
                .get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`,
                    {
                        timeout: 3000,
                    },
                )
                .then(async (res) => {
                    const regExp = new RegExp('\\(\\s*(.*)\\s*\\);$', 'mg');
                    const data = JSON.parse(
                        Array.from(res.data.matchAll(regExp))[0][1],
                    );

                    delete data['terms'];
                    delete data['privacy'];

                    logger.debug(JSON.stringify(data));

                    const point =
                        data['to'][0]['mid'].toString().indexOf('.') + 4;

                    await pool.query(
                        `INSERT INTO currency (from_currency, conv_currency, rate, date) VALUES ($1, $2, $3, $4)`,
                        [
                            value,
                            pair,
                            data['to'][0]['mid'].toString().slice(0, point),
                            new Date(data['timestamp']).toISOString().substring(0, 10),
                        ],
                    );
                })
                .catch(async (err) => {
                    logger.error(err);
                });
        }),
    );
}

module.exports = save_fiat;
