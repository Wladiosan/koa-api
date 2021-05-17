const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const passport = require('./src/libs/passport/koaPassport')
const errorCatcher = require('./src/middlewares/errorCatcher')

passport.initialize()

const app = new Koa()
app.use(cors())
app.use(bodyParser())

app.use(errorCatcher.errorCatcher)

const router = new Router()
const port = process.env.PORT || 3000

router.use('/', require('./src/users/users.router'))
app.use(router.middleware())

app.listen(port, () => {
    console.log(`SERVER IS STARTING AT PORT: ${port}`)
})
