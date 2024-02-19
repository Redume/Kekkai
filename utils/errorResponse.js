function response(status, statusCode, message) {
    return {
        status: status,
        statusCode: statusCode,
        data: {
            message: message
        }
    }
}

module.exports = response;