/**
 *
 * @param {string} status
 * @param {number} statusCode
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