const fs = require('fs');
const yaml = require('yaml');

const config = () => {
    try {
        fs.readFileSync('../config.yaml', 'utf-8');
    } catch { return }

    return yaml.parse(fs.readFileSync('../config.yaml', 'utf-8'));
}


module.exports = config;