const axios = require('axios');
const config = require('../../shared/config/src/main.js')();
const logger = require('../../shared/logger/src/main.js');
const token_rotate = require('../utils/token_rotate.js');

const exchangeratapi = config['currency']['services']['exchangeratapi'];

const active = [0];

module.exports = {
    info: {
        name: 'ExchangeRateAPI',
        type: 'fiat',
    },

    parseCurrencies: async () => {
        const fiatList = config['currency']['fiat'];

        const promises = fiatList.flatMap((fromCurrency) =>
            fiatList.map((convCurrency) => {
                if (fromCurrency === convCurrency) {
                    return Promise.resolve(null);
                }

                const serviceName = module.exports.info.name;

                const url = `${exchangeratapi['base_url']}/${exchangeratapi['api_key'][active[0]]}/pair/${fromCurrency}/${convCurrency}`;

                return axios
                    .get(url)
                    .then((res) => {
                        const data = res.data;

                        if (!data || typeof data.conversion_rate !== 'number') {
                            logger.error(
                                `Invalid data from ${serviceName} for ${fromCurrency} -> ${convCurrency}`,
                            );
                            return null;
                        }

                        logger.info(
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
                        logger.error(
                            `Error fetching ${fromCurrency} -> ${convCurrency} from ${serviceName}`,
                        );
                        logger.error(err);
                        token_rotate(exchangeratapi['api_key'], active);
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
