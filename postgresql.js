const pg = require("pg");
const yaml = require("yaml")
const fs = require("fs");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

const pool = new pg.Pool({
    user:  config['db']['user'],
    password: config['db']['password'],
    host: config['db']['host'],
    port: config['db']['port'],
    database: config['db']['name']
});

module.exports = pool;
