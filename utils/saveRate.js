const yaml = require('yaml');
const fs = require('fs');
const axios = require('axios');
const config = yaml.parse(fs.readFileSync('./config.yaml', 'utf-8'));
const Currency = require('../dao/Currency');

async function saveRate() {
    if (!config.currency.fiat) return;

    config.currency.fiatList.forEach(
        (value) => config.currency.fiatList.forEach(async (pair) => {
            if(value !== pair) {
                const res = await axios.get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`,
                    {
                        timeout: 3000,
                    }
                );

                if (!config['proxy']['host'] && res['data'] !== 200) {
                    res.config.proxy = {
                        protocol: config.proxy.protocol,
                        host: config.proxy.host,
                        port: config.proxy.port,
                        auth: {
                            username: config.proxy.auth.username,
                            password: config.proxy.auth.password,
                        }
                    }
                }

                const data = JSON.parse(res.data.replace('ddg_spice_currency(', '').replace(');', ''));
                delete data.terms;
                delete data.privacy;

                const point = data.to[0].mid.toString().indexOf('.') + 4;
                const currency = new Currency('fiat', value, pair, data.timestamp);
                const currency_data = await currency.getData();

                if (!Object.keys(currency_data).length) await currency.setData(
                    data['to'][0]['mid'].toString().slice(0, point)
                )
            }
        })
    );
}

module.exports = saveRate;