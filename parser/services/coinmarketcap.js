const axios = require('axios');
const config = require('../../shared/config/src/main.js')();
const logger = require('../../shared/logger/src/main.js');

module.exports = {
    info: {
        name: 'CoinMarketCap',
        type: 'crypto',
    },
    parseCurrencies: async () => {
        const promises = config['currency']['crypto'].map((fromCurrency) =>
            config['currency']['crypto'].map((convCurrency) => {
                if (fromCurrency === convCurrency) return Promise.resolve(null);

                const coinmarketcap =
                    config['currency']['services']['coinmarketcap'];
                const serviceName = module.exports.info.name;

                return axios
                    .get(coinmarketcap['base_url'], {
                        params: {
                            symbol: fromCurrency,
                            convert: convCurrency,
                        },
                        headers: {
                            'X-CMC_PRO_API_KEY': coinmarketcap['api_key'],
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
                        logger.error(err);
                        return null;
                    });
            }),
        );

        const flattenedPromises = promises.flat();
        const results = await Promise.all(flattenedPromises);

        return results.filter((result) => result !== null);
    },
};
