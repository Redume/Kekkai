const config = require('../config/main.js')();
const axios = require('axios');
const pool = require('../database/postgresql.js');


/**
 * Saves exchange rate of the cryptocurrency
 * @return {Object}
 */
function save_fiat() {
    if (!config['currency']['collecting']['crypto']) return;
    const depth = config['currency']['coinapiKeys']

    if (depth <= 0) new Error('Rate limit on all API tokens');

    config['currency']['crypto'].forEach(
        (value) => config['currency']['crypto'].forEach(async (pair) => {
          if (value !== pair) {
              const coinapiKey = [0];
              const res = await axios.get(`https://rest.coinapi.io/v1/exchangerate/${value}/${pair}`, {
                  timeout: 3000,
                  headers: {
                      'X-CoinAPI-Key': config['currency']['coinapiKeys'][coinapiKey[0]],
                  }
              });

              if (res.status === 429) rotate_key(config['currency']['coinapiKeys'], coinapiKey);

              const data = res.data;
              const point = data['rate'].toString().indexOf('.') + 4;

              pool.query('SELECT * FROM currency WHERE from_currency = $1 AND conv_currency = $2 AND date = $3',
                    [
                        value,
                        pair,
                        new Date(data['time']).toLocaleDateString()
                    ]).then(async (db) => {
                    if (db['rows'][0]) return;

                    await pool.query(`INSERT INTO currency (from_currency, conv_currency, rate, date) 
                        VALUES ($1, $2, $3, $4) RETURNING *`,
                        [
                            value,
                            pair,
                            data['rate'].toString().slice(0, point),
                            new Date(data['time']).toLocaleDateString()
                        ],
                    );
                });
          }
        })
    );
}

/**
 * Changing API keys
 * @param {Array} list - List of all keys
 * @param active - Active API key
 * @returns {number} - Outputs the number of the key that should work
 */

function rotate_key(list, active) {
    return active[0] = (active + 1) % list.length;
}

module.exports = save_fiat;