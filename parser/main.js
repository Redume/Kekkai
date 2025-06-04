const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const cron = require('cron-validator');

const { validateCurrency } = require('./models/Currency.js');
const pool = require('../shared/database/src/postgresql.js');
const create_table = require('../shared/database/src/create_table.js');
const config = require('../shared/config/src/main.js')();
const logger = require('../shared/logger/src/main.js');

const services = [];
const servicesDir = path.join(__dirname, 'services');

let fiatFetched = false;
let cryptoFetched = false;

function truncate_number(value, decimals) {
    const valueStr = value.toString();
    const dotIndex = valueStr.indexOf('.');
    if (dotIndex === -1) return valueStr;
    const desiredLength = dotIndex + decimals + 1;
    let truncated = valueStr.slice(0, desiredLength);

    if (parseFloat(truncated) === 0 && value > 0) {
        return valueStr;
    }
    return truncated;
}

async function main() {
    if (!config['schedule'])
        throw new Error('The crontab schedule is not set.');
    else if (!cron.isValidCron(config['schedule'], { alias: true }))
        throw new Error('The crontab is invalid.');

    logger.info('Loading services...');
    config['currency']['services']['enabled'].forEach((serviceName) => {
        const servicePath = path.join(servicesDir, `${serviceName}.js`);
        if (fs.existsSync(servicePath)) {
            const serviceModule = require(servicePath);

            services.push(serviceModule);
            logger.info(`Service ${serviceName} loaded successfully`);
        } else {
            logger.error(
                `Service file for ${serviceName} not found at ${servicePath}`,
            );
        }
    });

    await create_table();

    schedule.scheduleJob(config['schedule'], async () => {
        logger.info('Running scheduled task at:', new Date());

        fiatFetched = false;
        cryptoFetched = false;

        for (const srv of services) {
            const results = await srv.parseCurrencies();

            if (Array.isArray(results) && results.length > 0) {
                logger.info(
                    `Data received from ${srv.info.name || 'unknown service'}:`,
                    results.length,
                    'items',
                );

                for (const result of results) {
                    try {
                        if (srv.info.type === 'fiat' && fiatFetched) {
                            logger.info(
                                'Skipping fiat currency collection as data has already been fetched.',
                            );
                            continue;
                        }

                        if (srv.info.type === 'crypto' && cryptoFetched) {
                            logger.info(
                                'Skipping crypto currency collection as data has already been fetched.',
                            );
                            continue;
                        }

                        const currency = await validateCurrency(result);
                        const rate = truncate_number(currency.rate, 30);

                        await pool.query(
                            'INSERT INTO currency (from_currency, conv_currency, rate, date) VALUES ($1, $2, $3, $4)',
                            [
                                currency.from_currency,
                                currency.conv_currency,
                                rate,
                                currency.date,
                            ],
                        );
                        logger.info(
                            `Inserted data for ${currency.from_currency} -> ${currency.conv_currency}, Rate: ${rate}`,
                        );
                    } catch (validationError) {
                        logger.error('Validation failed for data:', result);
                        logger.error(validationError);
                    }
                }

                if (srv.info.type === 'crypto') {
                    cryptoFetched = true;
                    logger.info('Crypto currency data fetched successfully.');
                }

                if (srv.info.type === 'fiat') {
                    fiatFetched = true;
                    logger.info('Fiat currency data fetched successfully.');
                }
            } else {
                logger.error('Data not received for writing to the database.');
            }
        }
    });

    logger.info(`Scheduled task is running on schedule: ${config['schedule']}`);
}

main().catch(logger.error);
