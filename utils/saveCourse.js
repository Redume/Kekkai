const pool = require("../postgresql.js");
const yaml = require("yaml")
const fs = require("fs");
const axios = require("axios");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

async function saveCourse() {
    config['currency'].forEach(
        (value) => config['currency'].forEach(async (pair) => {
            if(value !== pair) {
                const res = await axios.get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`,
                    {
                        timeout: 3000
                    }
                )
                const data = JSON.parse(res.data.replace('ddg_spice_currency(', '').replace(');', ''))
                delete data['terms'];
                delete data['privacy'];
                console.log(data)

                const point = data['to'][0]['mid'].toString().indexOf('.') + 4

                pool.query('SELECT * FROM currency WHERE from_currency = $1 AND date = $2',
                        [
                            value,
                            data['timestamp']
                        ]
                    ).then(async (db) => {
                        if (!db['rows'][0]) {
                            await pool.query(`INSERT INTO currency (from_currency, conv_currency, rate, date) 
                                VALUES ($1, $2, $3, $4) RETURNING *`,
                                [
                                    value,
                                    pair,
                                    data['to'][0]['mid'].toString().slice(0, point),
                                    data['timestamp']
                                ]
                            )
                        }
                })
            }
        })
    );
}

module.exports = saveCourse;