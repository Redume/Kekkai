const axios = require('axios');
const config = require('../../shared/config/src/main.js')();
const logger = require('../../shared/logger/src/main.js');
const token_rotate = require('../utils/token_rotate.js');

const coinmarketcap = config['currency']['services']['coinmarketcap'];

const active = [0];

module.exports = {
    info: {
        name: 'CoinMarketCap',
        type: 'crypto',
    },

    parseCurrencies: async () => {
        const fromList = config['currency']['crypto'];

        const promises = fromList.flatMap((fromCurrency) =>
            fromList.map((convCurrency) => {
                if (fromCurrency === convCurrency) {
                    return Promise.resolve(null);
                }

                const serviceName = module.exports.info.name;

                return axios
                    .get(coinmarketcap['base_url'], {
                        params: {
                            symbol: fromCurrency,
                            convert: convCurrency,
                        },
                        headers: {
                            'X-CMC_PRO_API_KEY':
                                coinmarketcap['api_key'][active[0]],
                        },
                    })
                    .then((res) => {
                        const data =
                            res.data.data[fromCurrency].quote[convCurrency];

                        logger.info(
                            `Data fetched from ${serviceName}: ${fromCurrency} -> ${convCurrency}, Rate: ${data.price}`,
                        );

                        return {
                            from_currency: fromCurrency,
                            conv_currency: convCurrency,
                            rate: data.price,
                            date: data['last_updated'],
                        };
                    })
                    .catch((err) => {
                        logger.error(
                            `Error fetching ${fromCurrency} -> ${convCurrency} from ${serviceName}`,
                        );
                        logger.error(err);

                        token_rotate(coinmarketcap['api_key'], active);
                        return null;
                    });
            }),
        );

        const results = await Promise.all(promises);

        return results.filter(
            (result) => result !== null && result !== undefined,
        );
    },
};
