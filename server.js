require('colors');
const Koa           = require("koa");
const KoaRouter     = require('koa-router');
// const mongoose      = require('koa-mongoose');
const serve         = require('koa-static');

// Initialize application.
const app = new Koa();
const dbUri = '...';

const router = new KoaRouter();
const port = process.env.PORT || 3000;





// mongoose.Promise = Promise;








// Specific routes.
router.get('/donation', async (ctx) => {
    ctx.body = {
        ok: true
    }
});

app.use(router.routes())
    .use(router.allowedMethods())
    .use(serve(`${__dirname}/dist`))
    .listen(port, () => {
        console.log('Hi, I am the server for https://fundraiseup.com test run'.green);
        console.log('Server Started:'.green, 'http://localhost:'.grey + port.toString().blue);
    });