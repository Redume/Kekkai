const Joi = require('joi');

const currencySchema = Joi.object({
    from_currency: Joi.string().min(3).max(4).required().messages({
        'string.base': 'from_currency must be a string',
        'string.min': 'from_currency must be at least 3 characters long',
        'string.max': 'from_currency must be no more than 4 characters long',
        'any.required': 'from_currency is required',
    }),
    conv_currency: Joi.string().min(3).max(4).required().messages({
        'string.base': 'conv_currency must be a string',
        'string.min': 'conv_currency must be at least 3 characters long',
        'string.max': 'conv_currency must be no more than 4 characters long',
        'any.required': 'conv_currency is required',
    }),
    date: Joi.date().iso().required().messages({
        'date.base': 'date must be a valid ISO date',
        'any.required': 'date is required',
    }),
    rate: Joi.number().positive().required().messages({
        'number.base': 'rate must be a number',
        'number.positive': 'rate must be a positive number',
        'number.precision': 'rate must have no more than 6 decimal places',
        'any.required': 'rate is required',
    }),
});

async function validateCurrency(data) {
    try {
        const validatedData = await currencySchema.validateAsync(data);
        return validatedData;
    } catch (error) {
        const errorMessages = error.details.map((e) => e.message).join('; ');
        throw new Error(`Validation error(s): ${errorMessages}`);
    }
}

module.exports = { validateCurrency };
