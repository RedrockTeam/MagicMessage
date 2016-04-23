var router = require('koa-router')();
var indexController = require('../controllers/index');
var enableController = require('../controllers/enable');
router.get('/', indexController);
router.get('enable/openid/:openid', enableController);

module.exports = router;
