const ChartJSImage = require('chart.js-image');
const pool = require('../database/postgresql.js');

async function gen_chart(from_currency, conv_currency, start_date, end_date) {
    const data = await pool.query('SELECT date, rate FROM currency WHERE ' +
        '(date BETWEEN $3 AND $4) AND from_currency = $1 AND conv_currency = $2 ORDER BY date ', [
        from_currency.toUpperCase(),
        conv_currency.toUpperCase(),
        start_date,
        end_date
    ]);

    if (!data) return new Error('Missing data');

    const date = [];
    const rate = [];

    for (let i = 0; i < data.rows.length; i++) {
        date.push(data.rows[i].date.toLocaleDateString());
        rate.push(data.rows[i].rate);
    }

    const chart = ChartJSImage().chart({
        type: 'line',
        options: {
              title: {
                  display: true,
                  text: `${from_currency} / ${conv_currency}`,
              },
        },
        data: {
            labels: date,
            datasets: [
                {
                    label: 'rate',
                    borderColor: rate[rate.length-2] < rate[rate.length-1] ? 'rgb(24, 218, 39)' : 'rgb(243, 85, 50)',
                    backgroundColor:  rate[rate.length-2] < rate[rate.length-1] ? 'rgb(36, 175, 47)' : 'rgb(218, 56, 24)',
                    data: rate,
                    borderWidth: 2,
                },
            ],
        },
        scales: {
           xAxes: [
               {
                   scaleLabel: {
                       display: true,
                       labelString: 'Day'
                   },
               },
           ],
            yAxes: [
                {
                    stacked: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Rate'
                    },
                },
            ],
        },
    }).width(1000).height(1000);

    return chart.toURL();
}

module.exports = { gen_chart }