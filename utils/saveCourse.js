const pool = require("../postgresql.js");
const yaml = require("yaml")
const fs = require("fs");
const axios = require("axios");
const config = yaml.parse(fs.readFileSync("./config.yaml", "utf-8"));

async function saveCourse() {
    for (let i = 0; i < config['currency'].length; i++) {
        for (let pair in config['currency'] ) {
            const res = await axios.get(
                `https://duckduckgo.com/js/spice/currency/1/${config['currency'][i]}/${config['currency'][pair]}`
            )
            console.log(res.data)

            //TODO: добавить сохранение в бд
        }
    }


}

module.exports = saveCourse;