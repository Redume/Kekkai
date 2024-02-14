const fastify = require('fastify')({ logger: true });

fastify.route({
    method: 'GET',
    url: '/',
    schema: {
        querystring: {

        },
        response: {
            200: {

            }
        }
    },
    preHandler: async (res, reply) => {

    },
    handler: async (res, reply) => {

    }
})

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}