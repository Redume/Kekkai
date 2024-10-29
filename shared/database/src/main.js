const pool = require('./postgresql.js');
const logger = require('../../logger/src/main.js');

/**
 * Getting the currency exchange rate for a specific day
 * @param from_currency {String}
 * @param conv_currency {String}
 * @param date
 * @returns {Promise<*|Error>}
 */

async function getDay(from_currency, conv_currency, date) {
    if (!from_currency || !conv_currency)
        return new Error('fromCurrency and convCurrency are required');
    else if (!date) return new Error('date is required');

    const data = await pool.query(
        'SELECT from_currency, conv_currency, date, rate FROM currency ' +
            'WHERE from_currency = $1 AND conv_currency = $2 AND date = $3',
        [from_currency.toUpperCase(), conv_currency.toUpperCase(), date],
    );

    if (data?.['rows'].length <= 0) return 'Missing data';

    const set_date = data['rows'][0]['date'];
    data['rows'][0]['date'] = new Date(
        set_date.setDate(set_date.getDate() + 1),
    );

    logger.debug(data['rows'][0]);

    return data['rows'][0];
}

/**
 * Getting the exchange rate for a certain period
 * @param {String} from_currency - The currency that is being converted
 * @param {String} conv_currency - The currency to be converted into
 * @param {String} start_date - Start date of the period
 * @param {String} end_date - End date of the period
 * @returns {Promise<*|Error>}
 */

async function getPeriod(from_currency, conv_currency, start_date, end_date) {
    if (!from_currency || !conv_currency)
        return new Error('from_currency and conv_currency are required');
    else if (!start_date || !end_date)
        return new Error('start_date and end_date are required');

    const data = await pool.query(
        'SELECT * FROM currency WHERE ' +
            '(date BETWEEN $3 AND $4) AND from_currency = $1 AND conv_currency = $2 ORDER BY date',
        [
            from_currency.toUpperCase(),
            conv_currency.toUpperCase(),
            start_date,
            end_date,
        ],
    );

    if (data?.['rows'].length <= 0) return 'Missing data';

    for (let i = 0; i < data['rows'].length; i++) {
        let date = data['rows'][i]['date'];
        date = new Date(date.setDate(date.getDate() + 1));
    }

    logger.debug(data['rows']);

    return data['rows'];
}

module.exports = { getDay, getPeriod };
