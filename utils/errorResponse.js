function response(status, statusCode, message) {
    return {
        status: status,
        statusCode: status,
        data: {
            message: message
        }
    }
}

module.exports = response;