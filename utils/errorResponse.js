/**
 *
 * @param {number} status
 * @param {string} statusCode
 * @param {string} message
 * @returns  {{data: {message}, status, statusCode}}
 */

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