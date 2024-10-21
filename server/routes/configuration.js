const config = require('../../shared/config/src/main.js')();

module.exports = async function configurationRoutes(fastify) {
    fastify.get('/api/configurations/json', async function (req, res) {
        delete config['database'];
        delete config['currency']['coinapiKeys'];
        delete config['server']['ssl']['private_key'];
        delete config['server']['ssl']['cert'];
        delete config['analytics']['plausible_token'];

        return res.status(200).send({
            config,
        });
    });
};
