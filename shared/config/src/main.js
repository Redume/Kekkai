const fs = require('fs');
const hjson = require('hjson');

const path = require('path');

const config = () => {
    const configPath = path.join(__dirname, '../../../config.hjson');
    if (!fs.existsSync(configPath)) throw new Error('Config not found');

    return hjson.parse(fs.readFileSync(configPath, 'utf-8'));
};

module.exports = config;
