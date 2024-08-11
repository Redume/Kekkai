const ChartJSImage = require('chart.js-image');
const pool = require('../database/postgresql.js');
const fs = require('fs');
const request = require('request');
const logger = require('../logger/main.js')

/**
 * Graph generation
 * @param {String} from_currency - The currency that is being converted
 * @param {String} conv_currency - The currency to be converted into
 * @param {String} start_date - Start date of the period
 * @param {String} end_date - End date of the period
 * @returns {Promise<Error|string>}
 */
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
            scales: [
                {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: false,
                            }
                        }
                    ]
                }
            ]
        },
        data: {
            labels: date,
            datasets: [
                {
                    label: 'rate',
                    borderColor: rate[0] < rate[rate.length-1] ? 'rgb(24, 218, 39)' : 'rgb(243, 85, 50)',
                    backgroundColor:  rate[0] < rate[rate.length-1] ? 'rgb(36, 175, 47)' : 'rgb(218, 56, 24)',
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

    logger.debug(chart.toURL());

    return chart.toURL();
}


/**
 * Saving a graph to a file
 * @param {String} url  - URL (or Buffer) to the chart
 * @param {String} filename - filename
 */
function save_chart(url, filename) {
    if (!fs.existsSync('../charts')) fs.mkdirSync('../charts');
    if (!url.startsWith('https://')) throw new Error('The passed parameter is not a URL');

    logger.info(`The schedule has been saved. The path of the graph 'chart/${filename}'`);

    request(url).pipe(fs.createWriteStream(`../charts/${filename}`));
}

module.exports = { gen_chart, save_chart }