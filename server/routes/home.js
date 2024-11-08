module.exports = async function getRateRoute(fastify) {
    fastify.get('/', async function (req, res) {
        return res.status(200).send({
            message: 'Hello World!',
            documentation: 'https://kekkai-docs.redume.su/',
        });
    });
};
