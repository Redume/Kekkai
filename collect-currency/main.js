const schedule = require('node-schedule');
const config = require('../shared/config/src/main.js')();
const cron = require('cron-validator');

const save_fiat = require('./save_fiat');
const save_crypto = require('./save_crypto');

async function main() {
    const config_schedule = config['currency']['collecting']['schedule'];
    if (!config_schedule) throw new Error('The crontab schedule is not set');
    if (!cron.isValidCron(config_schedule, {alias: true})) throw new Error('The crontab is invalid');

    await save_fiat();
    await save_crypto();

    schedule.scheduleJob(config_schedule, async function () {
        await save_fiat();
        await save_crypto();
    });
}

main();

module.exports = {main};