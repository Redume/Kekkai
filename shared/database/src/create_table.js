const fs = require('fs');
const pool = require('./postgresql.js');

const logger = require('../../logger/src/main.js');

async function create_table() {
    const schema = fs.readFileSync(
        '../shared/database/data/schema.sql',
        'utf8',
    );

    const queries = schema
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query);

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
