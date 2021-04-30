const Koa = require('koa')
const Router = require('koa-router')
const globalRouter = require('./src/router')

const app = new Koa()

const router = new Router()
const port = process.env.PORT || 3030

router.use('/', globalRouter.router.routes())

app.use(router.routes())

app.listen(port, () => {
    console.log(`SERVER IS STARTING AT PORT: ${port}`)
})
