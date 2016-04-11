var router = require('koa-router')();
var indexController = require('../controllers/index');
router.get('/', indexController);
module.exports = router;
