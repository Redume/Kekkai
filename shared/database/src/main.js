const pool = require('./postgresql.js');
const logger = require('../../logger/src/main.js');

async function getDay(from_currency, conv_currency, date, conv_amount) {
    if (!from_currency || !conv_currency)
        return new Error('fromCurrency and convCurrency are required');
    else if (!date) return new Error('date is required');

    const data = await pool.query(
        'SELECT from_currency, conv_currency, date, rate FROM currency ' +
            'WHERE from_currency = $1 AND conv_currency = $2 AND date::date = $3::date',
        [from_currency.toUpperCase(), conv_currency.toUpperCase(), date],
    );

    if (data?.['rows'].length <= 0) return 'Missing data';

    if (conv_amount) {
        let rate = data?.['rows']?.[0]?.['rate'] || 0;
        let final_value = multiplyHuge(conv_amount, rate);
        data['rows'][0]['conv_amount'] = final_value;
    }

    logger.debug(data['rows'][0]);

    return data['rows'][0];
}

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

    logger.debug(data['rows']);

    return data['rows'];
}

function multiplyHuge(amount, rate) {
    const rateStr = rate.toString();
    const decimalPlaces = rateStr.includes('.') ? rateStr.split('.')[1].length : 0;
    
    const bigAmount = BigInt(amount.toString().split('.')[0]); 
    const bigRate = BigInt(rateStr.replace('.', ''));
    
    let result = (bigAmount * bigRate).toString();
    
    if (decimalPlaces > 0) {
        const splitIndex = result.length - decimalPlaces;
        if (splitIndex > 0) {
            result = result.slice(0, splitIndex) + '.' + result.slice(splitIndex);
        } else {
            result = '0.' + result.padStart(decimalPlaces, '0');
        }
    }
    
    return result;
}

module.exports = { getDay, getPeriod };
