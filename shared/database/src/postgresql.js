const pg = require('pg');
const config = require('../../config/src/main.js')();

const pool = new pg.Pool({
    user: config['database']['user'],
    password: config['database']['password'],
    host: config['database']['host'],
    port: config['database']['port'],
    database: config['database']['name'],
});

module.exports = pool;
