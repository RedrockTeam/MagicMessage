var router = require('koa-router')();
var apiController = require('../controllers/api');
router.post('/multi', apiController.multi);

module.exports = router;
