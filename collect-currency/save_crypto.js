const pool = require('../shared/database/src/postgresql.js');
const axios = require('axios');
const config = require('../shared/config/src/main.js')();
const logger = require('../shared/logger/src/main.js');

async function save_crypto() {
    if (!config['currency']['collecting']['crypto']) return;
    
    config['currency']['crypto'].forEach((value) => 
        config['currency']['crypto'].forEach(async (pair) => {
            if (value === pair) return;
            
            await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
                timeout: 3000,
                params: {
                    'symbol': value, 
                    'convert': pair,
                },
                headers: {
                    'X-CMC_PRO_API_KEY': config['currency']['collecting']['crypto_apikey'],
                }
            })
                .then(async (res) => {
                    const data = res['data']['data'][value]['quote'][pair];

                    logger.debug(JSON.stringify(data, null, 4));
                    
                    const point = data['price'].toString().indexOf('.') + 4;

                    const db = await pool.query(
                        'SELECT * FROM currency WHERE ' +
                        'from_currency = $1 AND conv_currency = $2 AND date = $3',
                        [
                            value,
                            pair,
                            new Date(data['last_updated']).toISOString().substring(0, 10),
                        ],
                    );

                    if (db['rows'][0]) return;
                    await pool.query(
                        `INSERT INTO currency (from_currency, conv_currency, rate, date) VALUES ($1, $2, $3, $4)`,
                        [
                            value,
                            pair,
                            data['price'].toString().slice(0, point),
                            new Date(data['last_updated']).toISOString().substring(0, 10),
                        ],
                    );
                })
                .catch((err) => {
                    logger.error(err);
                });
        })
    );
}

module.exports = save_crypto;