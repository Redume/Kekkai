const fs = require('fs');
const yaml = require('yaml');

const config = () => {
    if (!fs.existsSync('../config.yaml')) return;

    return yaml.parse(fs.readFileSync('../config.yaml', 'utf-8'));
};

module.exports = config;
