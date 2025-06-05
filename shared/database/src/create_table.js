const fs = require('fs').promises;
const pool = require('./postgresql.js');
const path = require('path');
const logger = require('../../logger/src/main.js');

async function create_table() {
    const filePath = path.join('/shared/database/schemas/data.sql');

    let schema;
    try {
        schema = await fs.readFile(filePath, 'utf8');
        console.log('File read successfully!');
    } catch (err) {
        console.error('File does not exist or error reading file:', filePath);
        return;
    }

    const queries = schema
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
