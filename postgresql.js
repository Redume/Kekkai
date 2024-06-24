const pg = require("pg");
const yaml = require("yaml")
const fs = require("fs");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

const pool = new pg.Pool({
    user:  config['database']['user'],
    password: config['database']['password'],
    host: config['database']['host'],
    port: config['database']['port'],
    database: config['database']['name']
});

module.exports = pool;
