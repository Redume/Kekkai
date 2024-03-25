const pool = require('../postgresql.js');

class Currency {
    constructor(table, fromCurrency, convCurrency, periodStart, periodEnd) {
        this.table = table;
        this.fromCurrency = fromCurrency;
        this.convCurrency = convCurrency;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
    };

    async getData() {
        let data = await pool.query(`SELECT from_currency, conv_currency, rate, date FROM ${this.table} 
                                        WHERE from_currency = $1
                                            AND conv_currency = $2 
                                            AND date = $3`, [
                                                this.fromCurrency,
                                                this.convCurrency,
                                                this.periodStart
            ]);

        if (!data?.rows[0]) return {};

        if (this.periodEnd) {
            const data = await pool.query(`SELECT from_currency, conv_currency, rate, date FROM ${this.table} 
                                        WHERE (date BETWEEN $3 AND $4) 
                                            AND from_currency = $1 
                                            AND conv_currency = $2`, [
                                                this.fromCurrency,
                                                this.convCurrency,
                                                this.periodStart,
                                                this.periodEnd,
                ]);

            if (!data?.rows[0]) return {};

            for (let i = 0; i < data.rows.length; i++) {
                const date = data.rows[0].date;
                data.rows[0].date = new Date(date.setDate(date.getDate() + 1)).toISOString();
            }

            return data.rows;
        }

        const date = data.rows[0].date;
        data.rows[0].date = new Date(date.setDate(date.getDate() + 1)).toISOString();

        return data.rows;
    };

    async setData(rate) {
        const data = await pool.query(`SELECT from_currency, conv_currency, rate, date FROM ${this.table} 
                                                WHERE from_currency = $1 
                                                  AND conv_currency = $2 
                                                  AND date = $3`, [
                                                        this.fromCurrency,
                                                        this.convCurrency,
                                                        this.periodStart
            ]);

        if (data?.rows[0]) return false;

        await pool.query(`INSERT INTO ${this.table} (from_currency, conv_currency, rate, date) 
                            VALUES ($1, $2, $3, $4) 
                            RETURNING from_currency, conv_currency, rate, date`, [
                                this.fromCurrency,
                                this.convCurrency,
                                rate,
                                this.periodStart
            ]);

        return true;
    };
}

module.exports = Currency;
