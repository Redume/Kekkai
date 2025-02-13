const fs = require("node:fs");

module.exports = async function homeRoute(fastify) {
    fastify.get('/', (req, res) => {
        res.send(fs.createReadStream('./src/html/index.html'));
    });
}