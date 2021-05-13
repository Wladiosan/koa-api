const Router = require('koa-joi-router')

const joi = Router.Joi

const userSchema = {
    first_name: joi.string().min(3).required(),
    last_name: joi.string().min(3).required(),
    email: joi.string().required(),
}

exports.checkBeforeRegistration = {
    validate: {
        type: 'json',
        body: {
            email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ru']}}),
            username: joi.string().min(3).required(),
            first_name: joi.string().min(3).required(),
            last_name: joi.string().min(3).required()
        }
    }
}

exports.create = {
    validate: {
        type: 'json',
        body: {
            email: joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'ru']}}),
            username: joi.string().min(3).required(),
            first_name: joi.string().min(3).required(),
            last_name: joi.string().min(3).required(),
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







exports.example = {
    validate: {
        type: 'json',
        body: {
            message: joi.string().min(3).required()
        }
    }
}



exports.signUp = {
    validate: {
        type: 'json',
        body: {
            ...userSchema,
            password: joi.string().min(6).required(),
            active: joi.bool().required(),
            username: joi.string().min(3).required()
        },
        output: {
            201: {
                body: {
                    ...userSchema,
                    is_active: joi.bool().required(),
                    categoryid: joi.number().required(),
                }
            }
        }
    }
}
