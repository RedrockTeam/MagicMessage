/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 * 启动的时候运行
 */
import schedule from 'node-schedule';
import moment from 'moment';

import modelSchedule from '../models/schedule';
import modelTask from '../models/task';

import taskGenerator from './taskGenerator';

const scheduled = schedule.scheduleJob('*/1 * * * *', () => {
  const nowMinute = moment().format('HH:mm');
  modelTask.findAll({where: {time: nowMinute}}).then(async tasks => {
    for (let task of tasks) {
      const schedule = await modelSchedule.findById(task.schedule_id);
      const _task = await taskGenerator(schedule.get({plain: true}), task.get({plain: true}));
      _task();
    }
  });
});

export default scheduled;
