const Router = require("koa-router");
const Controller = require("../controllers").donations;
const router = new Router();

// Specific routes.
router.post('/donation', Controller.store);

module.exports = router.routes();