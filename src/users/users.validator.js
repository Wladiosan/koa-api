const Router = require('koa-joi-router')

const joi = Router.Joi

const userSchema = {
    email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ru']}}),
    username: joi.string().min(3).required(),
    first_name: joi.string().min(3).required(),
    last_name: joi.string().min(3).required()
}

exports.checkBeforeRegistration = {
    validate: {
        type: 'json',
        body: {...userSchema}
    }
}

exports.create = {
    validate: {
        type: 'json',
        body: {
            ...userSchema,
            password: joi.string().min(6).required()
        }
    }
}

exports.signIn = {
    validate: {
        type: 'json',
        body: {
            email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ru']}}),
            password: joi.string().min(6).required()
        }
    }
}
