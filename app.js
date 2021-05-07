const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const globalRouter = require('./src/router')
const passport = require('./src/libs/passport/koaPassport')

passport.initialize()

const app = new Koa()
app.use(cors())
app.use(bodyParser())

// Глобальный обработчик ошибок
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        // Отлавливаем ошибку валидатора Joi
        if (err.isJoi) {
            ctx.throw(400, err.details[0].message)
        }
        if (err.isPassport) {
            ctx.throw(400, err.message)
        }
        ctx.throw(err.status || 500, err.message)
    }
})

const router = new Router()
const port = process.env.PORT || 3030

router.use('/', globalRouter.router.routes())

app.use(router.routes())

app.listen(port, () => {
    console.log(`SERVER IS STARTING AT PORT: ${port}`)
})
