const config = require('../config/main.js')();
const axios = require('axios');
const pool = require('../database/postgresql.js');
const logger = require('../logger/main.js');

const coinapiKeys = config['currency']['coinapiKeys'];
let apiKeyIndex = 0;
let depth = coinapiKeys.length;

function save_crypto() {
    if (!config['currency']['collecting']['crypto']) return;
    if (coinapiKeys[apiKeyIndex] === undefined) return;

    if (depth <= 0) {
        logger.info('Rate limit on all coinapi API keys');
        new Error('Rate limit on all coinapi API keys');
        return;
    }

    logger.info(`Active coinapi key: ${coinapiKeys[apiKeyIndex]} (${coinapiKeys.length-1} / ${apiKeyIndex})`);

    config['currency']['crypto'].forEach(
        (value) => config['currency']['crypto'].forEach((pair) => {
            if (value === pair) return;

            axios.get(`https://rest.coinapi.io/v1/exchangerate/${value}/${pair}`,
                {
                    timeout: 3000,
                    headers: {
                        'X-CoinAPI-Key': coinapiKeys[apiKeyIndex],
                    }
                }).then(async (res) => {

                    const data = res.data;
                    const point = data['rate'].toString().indexOf('.') + 4;

                    logger.debug(JSON.stringify(data));

                    const db = await pool.query('SELECT * FROM currency WHERE from_currency = $1 AND conv_currency = $2 AND date = $3',
                        [
                            value,
                            pair,
                            new Date(data['time']).toLocaleDateString()
                        ])

                    if (db['rows'][0]) return;
                    await pool.query(`INSERT INTO currency (from_currency, conv_currency, rate, date) 
                                    VALUES ($1, $2, $3, $4)`,
                                [
                                    value,
                                    pair,
                                    data['rate'].toString().slice(0, point),
                                    new Date(data['time']).toLocaleDateString()
                                ]);

            }).catch((err) => {
               if (err.response?.data.detail) logger.error(err.response.data.detail);
               if (err.response?.data.status === 429) {
                   logger.info('CoinAPI rate limited, rotating token')
                   rotate_key(coinapiKeys);
                   depth--
                   save_crypto();
               }
            });
        })
    );
}

/**
 * Changing API keys
 * @param {Array} list - List of all keys
 * @returns {number} - Outputs the number of the key that should work
 */

function rotate_key(list) {
    apiKeyIndex = list.indexOf(coinapiKeys[apiKeyIndex]) + 1
}

module.exports = save_crypto;