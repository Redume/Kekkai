const pool = require('../database/postgresql.js');
const axios = require('axios');
const config = require('../config/main.js')();

async function save_fiat() {
    if (!config['currency']['collecting']['fiat']) return;

    config['currency']['fiat'].forEach(
        (value) => config['currency']['fiat'].forEach(async (pair) => {
            if(value !== pair) {
                const res = await axios.get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`,
                    {
                        timeout: 3000,
                    }
                );

                const regExp = new RegExp('\\(\\s*(.*)\\s*\\);$', 'mg');
                const data = JSON.parse(Array.from(res.data.matchAll(regExp))[0][1])
                console.log(data)

                delete data['terms'];
                delete data['privacy'];

                const point = data['to'][0]['mid'].toString().indexOf('.') + 4;

                pool.query('SELECT * FROM currency WHERE from_currency = $1 AND conv_currency = $2 AND date = $3',
                        [
                            value,
                            pair,
                            new Date(data['timestamp']).toLocaleDateString()
                        ],
                    ).then(async (db) => {
                        if (!db['rows'][0]) {
                            await pool.query(`INSERT INTO currency (from_currency, conv_currency, rate, date) 
                                VALUES ($1, $2, $3, $4) RETURNING *`,
                                [
                                    value,
                                    pair,
                                    data['to'][0]['mid'].toString().slice(0, point),
                                    new Date(data['timestamp']).toLocaleDateString()
                                ],
                            );
                        }
                });
            }
        })
    );
}

module.exports = save_fiat;
