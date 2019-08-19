const Router = require("koa-router");
const router = new Router();
const donations = require("./donation-router");

router.use(donations);
module.exports = router;