const pg = require("pg");
const yaml = require("yaml")
const fs = require("fs");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

const pool = new pg.Pool({
    user:  config['db_user'],
    password: config['db_password'],
    host: config['db_host'],
    port: config['db_port'],
    database: config['db_name']
});

module.exports = pool;
