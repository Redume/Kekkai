const fs = require('fs');
const hjson = require('hjson');

const config = () => {
    if (!fs.existsSync('../config.hjson')) throw new Error('Config not found');

    return hjson.parse(fs.readFileSync('../config.hjson', 'utf-8'));
};

module.exports = config;
