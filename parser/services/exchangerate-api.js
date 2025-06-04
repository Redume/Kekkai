const axios = require('axios');
const config = require('../../shared/config/src/main.js')();

module.exports = {
    info: {
        name: 'ExchangeRateAPI',
        type: 'fiat',
    },
    parseCurrencies: async () => {
        const promises = config['currency']['fiat'].map((fromCurrency) =>
            config['currency']['fiat'].map((convCurrency) => {
                if (fromCurrency === convCurrency) return Promise.resolve(null);

                const exchangeratapi =
                    config['currency']['services']['exchangeratapi'];
                const serviceName = module.exports.info.name;

                return axios
                    .get(
                        `${exchangeratapi['base_url']}/${exchangeratapi['api_key']}/pair/${fromCurrency}/${convCurrency}`,
                    )
                    .then((res) => {
                        const data = res.data;

                        console.log(
                            `Data fetched from ${serviceName}: ${fromCurrency} -> ${convCurrency}, Rate: ${data.conversion_rate}`,
                        );

                        return {
                            from_currency: fromCurrency,
                            conv_currency: convCurrency,
                            rate: data.conversion_rate,
                            date: new Date(),
                        };
                    })
                    .catch((err) => {
                        console.error(err);
                        return null;
                    });
            }),
        );

        const flattenedPromises = promises.flat();
        const results = await Promise.all(flattenedPromises);

        return results.filter((result) => result !== null);
    },
};
