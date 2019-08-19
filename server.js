const Koa           = require("koa");
const KoaCors       = require('@koa/cors');
const KoaBody       = require('koa-body');
const KoaValidator  = require('koa-async-validator');
const mongoose      = require('mongoose');
const serve         = require('koa-static');
const routes        = require("./server/routes");

require('colors');

// Initialize application.
const port = process.env.PORT || 3000;
const app = new Koa();
      app.use(KoaCors());
      app.use(KoaBody({ multipart: true }));
      app.use(KoaValidator());


// Database connection.
let db = 'donation';
mongoose.connect('mongodb://localhost/' + db, {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to «${db}» database`.green);
    })
    .catch(err => {
        console.error(`Сonnection error: ${err.message}`.red)
    });


app.use(routes.routes())
    .use(routes.allowedMethods())
    .use(serve(`${__dirname}/dist`))
    .listen(port, () => {
        console.log('Hi, I am the server for https://fundraiseup.com test run'.green);
        console.log('Server Started:'.green, 'http://localhost:'.grey + port.toString().blue);
    });