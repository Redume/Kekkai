const schedule = require('node-schedule');
const config = require('../shared/config/src/main.js')();
const cron = require('cron-validator');

const save_fiat = require('./save_fiat');
const save_crypto = require('./save_crypto');
const logger = require('../shared/logger/src/main.js');

async function validateSchedule(schedule) {
    if (!schedule) throw new Error('The crontab schedule is not set');
    if (!cron.isValidCron(schedule, { alias: true }))
        throw new Error('The crontab is invalid');
}

async function initialize() {
    //await require('../shared/database/src/create_table')();
}

async function runTasks() {
    await Promise.all([save_fiat(), save_crypto()]);
}

async function main() {
    console.log(config['currency']['collecting']['schedule'])
    await initialize();
    await validateSchedule(config['currency']['collecting']['schedule']);

    await runTasks();

    schedule.scheduleJob(
        config['currency']['collecting']['schedule'],
        runTasks,
    );
}

main();

module.exports = { main };
