const Koa = require('koa')
const Router = require('koa-router')
const globalRouter = require('./src/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
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
        ctx.throw(400, 'Something wrong')
    }
})

const router = new Router()
const port = process.env.PORT || 3030

router.use('/', globalRouter.router.routes())

app.use(router.routes())

app.listen(port, () => {
    console.log(`SERVER IS STARTING AT PORT: ${port}`)
})
