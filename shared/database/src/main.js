const pool = require('./postgresql.js');
const logger = require('../../logger/src/main.js');

function toPlainString(num) {
    const s = String(num);
    if (!s.includes('e') && !s.includes('E')) return s;
    return BigInt(Math.round(Number(num))).toString();
}

function multiplyHuge(amount, rate) {
    const amountStr = toPlainString(amount);
    const rateStr = toPlainString(rate);

    const aDecimals = amountStr.includes('.')
        ? amountStr.split('.')[1].length
        : 0;
    const rDecimals = rateStr.includes('.')
        ? rateStr.split('.')[1].length
        : 0;
    const totalDecimals = aDecimals + rDecimals;

    const bigA = BigInt(amountStr.replace('.', ''));
    const bigR = BigInt(rateStr.replace('.', ''));

    let result = (bigA * bigR).toString();

    if (totalDecimals > 0) {
        result = result.padStart(totalDecimals + 1, '0');
        const splitIndex = result.length - totalDecimals;
        result = result.slice(0, splitIndex) + '.' + result.slice(splitIndex);
        result = result.replace(/\.?0+$/, '');
    }

    return result;
}

async function getDay(from_currency, conv_currency, date, conv_amount) {
    if (!from_currency || !conv_currency)
        return 'fromCurrency and convCurrency are required';
    else if (!date) return 'date is required';

    const data = await pool.query(
        'SELECT from_currency, conv_currency, date, rate FROM currency ' +
            'WHERE from_currency = $1 AND conv_currency = $2 AND date::date = $3::date',
        [from_currency.toUpperCase(), conv_currency.toUpperCase(), date],
    );

    if (data?.['rows'].length <= 0) return 'Missing data';

    data['rows'][0]['rate'] = toPlainString(data['rows'][0]['rate']);

    if (conv_amount) {
        data['rows'][0]['conv_amount'] = multiplyHuge(
            conv_amount,
            data['rows'][0]['rate'],
        );
    }

    logger.debug(data['rows'][0]);
    return data['rows'][0];
}

async function getPeriod(from_currency, conv_currency, start_date, end_date) {
    if (!from_currency || !conv_currency)
        return 'from_currency and conv_currency are required';
    else if (!start_date || !end_date)
        return 'start_date and end_date are required';

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

    data['rows'] = data['rows'].map((row) => ({
        ...row,
        rate: toPlainString(row.rate),
    }));

    logger.debug(data['rows']);
    return data['rows'];
}

module.exports = { getDay, getPeriod };
