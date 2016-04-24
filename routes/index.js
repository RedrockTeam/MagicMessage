import Router from 'koa-router';
const router = Router();
import indexController from '../controllers/index';
import enableController from '../controllers/enable';
import disableReminderController from '../controllers/disableReminder';

router.get('/', indexController);
router.get('enable/openid/:openid', enableController);
router.get('disableReminder/openid/:openid/task/:task_id', disableReminderController);

export default router;
