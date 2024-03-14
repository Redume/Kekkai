const pool = require('../postgresql.js');
const yaml = require('yaml');
const fs = require('fs');
const axios = require('axios');
const axiosRetry = require('axios-retry').default
const config = yaml.parse(fs.readFileSync('./config.yaml', 'utf-8'));

async function saveRate() {
    config['currency'].forEach(
        (value) => config['currency'].forEach(async (pair) => {
            if(value !== pair) {
                const res = await axios.get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`,
                    {
                        timeout: 3000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                        }
                    }
                );

                if (!config['proxy']['host'] && !res['data']) {
                    res.config.proxy = {
                        protocol: config['proxy']['protocol'],
                        host: config['proxy']['host'],
                        port: config['proxy']['port'],
                        auth: {
                            username: config['proxy']['auth']['username'],
                            password: config['proxy']['auth']['password'],
                        }
                    }
                }

                axiosRetry(axios, {
                    retries: 3
                })

                const data = JSON.parse(res.data.replace('ddg_spice_currency(', '').replace(');', ''));
                delete data['terms'];
                delete data['privacy'];

                const point = data['to'][0]['mid'].toString().indexOf('.') + 4;

                pool.query('SELECT * FROM currency WHERE from_currency = $1 AND conv_currency = $2 AND date = $3',
                        [
                            value,
                            pair,
                            new Date(data['timestamp']).toLocaleDateString()
                        ]
                    ).then(async (db) => {
                        if (!db['rows'][0]) {
                            await pool.query(`INSERT INTO currency (from_currency, conv_currency, rate, date) 
                                VALUES ($1, $2, $3, $4) RETURNING *`,
                                [
                                    value,
                                    pair,
                                    data['to'][0]['mid'].toString().slice(0, point),
                                    new Date(data['timestamp']).toLocaleDateString()
                                ]
                            );
                        }
                });
            }
        })
    );
}

module.exports = saveRate;