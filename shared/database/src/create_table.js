const fs = require('fs');
const pool = require('./postgresql.js');

async function create_table() {
    const schema = fs.readFileSync('../shared/database/data/schema.sql', 'utf8');

    for (let i = 0; i < schema.split(';').length; i++) {
        try {
            await pool.query(schema.split(';')[i]);
        } catch (err) { continue }
    }
}

module.exports = create_table;