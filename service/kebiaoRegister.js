/**
 * Created at 16/4/22.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import modelSchedule from '../models/schedule';
import modelTask from '../models/task';
import moment from 'moment';

const timeEveryClassStart = ['08:00', '10:05', '14:00', '16:05', '19:00', '20:50'];
const templateIds = {
  everyDay: '7R2_kbC_FoXP7o9oFWxpkzvzgcz04L8CpjfG6g7NkRA',
  everyClass: 'XgBPsF4rb4A0GUkoP-WgsFwhVUpgKv8G1SMevcKLWLc'
};

export default async function(openid, type, option = {}) {
  const earlier = Number(option['earlier']) || 10; // 提早多少分钟通知
  const _validRemindTime = moment(option['remindTime'], 'HH:mm').format('HH:mm');
  const everyDayRemindTime = _validRemindTime !== 'Invalid date' ? _validRemindTime : '22:00'; // 通知时间

  const defaultData = { openid: openid, template_id: templateIds[type], type: 'kebiao', data: {type: type} };
  switch (type) {
    case 'everyClass': defaultData.data.earlier = earlier; break;
    case 'everyDay': defaultData.data.remindTime = everyDayRemindTime;
  }
  modelSchedule.findOrCreate({
    where: {openid: openid, type: 'kebiao'},
    defaults: defaultData
  }).spread(async (schedule, created) => {
    if (!created) { // row already exists
      await schedule.update(defaultData);
    }

    const scheduleId = schedule.id;
    modelTask // 这里删除已有的 task
      .findAll({where: {schedule_id: scheduleId}})
      .then(async oldScheduledTasks => {
        for (let t of oldScheduledTasks) {
          await t.destroy();
        }
      });

    if (type === 'everyClass') {
      timeEveryClassStart.forEach(async (time, no) => {
        const sendTime = moment(time, 'HH:mm').add(-earlier, 'm').format('HH:mm');
        await modelTask.create({time: sendTime, schedule_id: scheduleId, data: {
          kebiaoType: type,
          courseNo: no,
          earlier: earlier
        }});
      });
    } else if (type === 'everyDay') {
      await modelTask.create({time: everyDayRemindTime, schedule_id: scheduleId, data: {
        kebiaoType: type,
        remindTime: everyDayRemindTime
      }});
    } else if (type === 'none') {
      // do nothing
    }
  });
};
