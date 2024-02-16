const pool = require("../postgresql.js");
const yaml = require("yaml")
const fs = require("fs");
const axios = require("axios");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

async function saveCourse() {

    let pairs = [];
    let currencies = ["USD", "RUB", "UAH", "JDF"]
    config['currency'].forEach(
        (value) => config['currency'].forEach(async (pair) => {
            if(value !== pair) {
                const res = await axios.get(
                    `https://duckduckgo.com/js/spice/currency/1/${value}/${pair}`
                )
                console.log(res.data)
            }
        })
    );

}

module.exports = saveCourse;