const Router = require('koa-joi-router')

const joi = Router.Joi

exports.example = {
    validate: {
        type: 'json',
        body: {
            message: joi.string().min(3).required()
        }
    }
}

exports.signIn = {
    validate: {
        type: 'json',
        body: {
            email: joi.string().required(),
            password: joi.string().min(6).required()
        }
    }
}
