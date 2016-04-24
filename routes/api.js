var router = require('koa-router')();
var apiController = require('../controllers/api');
router.post('/multi', apiController.multi);
router.post('/addSchedule', apiController.addSchedule);
router.post('/status', apiController.status);
router.post('/updateState', apiController.updateState);
router.post('/instantMessage', apiController.instantMessage);

module.exports = router;
