const fs = require('fs');
const path = require('path');
const pool = require('./postgresql.js');

const logger = require('../../logger/src/main.js');

async function create_table() {
    const schemaPath = path.join(__dirname, '../schemas/data.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    const queries = schemaContent
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query.length > 0);

    for (const query of queries) {
        try {
            await pool.query(query);
            logger.info(`Executed query: ${query}`);
        } catch (err) {
            logger.error(err);
        }
    }
}

module.exports = create_table;
