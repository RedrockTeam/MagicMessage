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
import TaskQueue from './TaskQueue';

const queue = new TaskQueue(10);
const scheduled = schedule.scheduleJob('*/1 * * * *', () => {
  const nowMinute = moment().format('HH:mm');
  const nowDate = moment().format('YYYY-MM-DD');
  modelTask.findAll({where: {
    $or: [{date: '', time: nowMinute}, {date: nowDate, time: nowMinute}]
  }}).then(async tasks => {
    for (let task of tasks) {
      const schedule = await modelSchedule.findById(task.schedule_id);
      const _task = await taskGenerator(schedule.get({plain: true}), task.get({plain: true}));
      queue.run(_task);
    }
  });
});

export default scheduled;
