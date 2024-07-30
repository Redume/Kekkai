const pool = require('./postgresql.js');

async function getDay(from_currency, conv_currency, date) {
    if (!from_currency || !conv_currency || !date) return

    const data = await pool.query('SELECT from_currency, conv_currency, date, rate FROM currency ' +
        'WHERE from_currency = $1 AND conv_currency = $2 AND date = $3', [
            from_currency.toUpperCase(),
            conv_currency.toUpperCase(),
            date
        ]);

    if (!data) return;

    return data['rows'][0];
}

async function getPeriod(from_currency, conv_currency, start_date, end_date) {
    if (!from_currency || !conv_currency || !start_date || !end_date) return

    const data = await pool.query('SELECT * FROM currency WHERE ' +
        '(date BETWEEN $3 AND $4) AND from_currency = $1 AND conv_currency = $2', [
            from_currency,
            conv_currency,
            start_date,
            end_date
    ]);

    if (!data) return;

    return data['rows'];
}


module.exports = { getDay, getPeriod };
