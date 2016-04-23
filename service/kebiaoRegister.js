/**
 * Created at 16/4/22.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import modelSchedule from '../models/schedule';
import modelTask from '../models/task';

const Times = {
  everyDay: ['22:00'],
  everyClass: ['07:50', '09:50', '13:50', '15:55', '18:50', '20:40'],
  none: []
};
const templateIds = {
  everyDay: '7R2_kbC_FoXP7o9oFWxpkzvzgcz04L8CpjfG6g7NkRA',
  everyClass: 'XgBPsF4rb4A0GUkoP-WgsFwhVUpgKv8G1SMevcKLWLc',
  none: ''
};
export default async function(openid, type) {
  modelSchedule.findOrCreate({
    where: {openid: openid},
    defaults: { openid: openid, template_id: templateIds[type], type: 'kebiao', data: {type: type} }
  }).spread(function(schedule, created) {
    if (!created) {
      schedule.update({
        template_id: templateIds[type],
        data: {type: type}
      }).then(function() {});
    }

    const plainSchedule = schedule.get({plain: true});
    const scheduleId = plainSchedule.id;
    modelTask
      .findAll({where: {schedule_id: scheduleId}})
      .then(async function(oldScheduledTasks) {
        for (let t of oldScheduledTasks) {
          await t.destroy();
        }
      });

    Times[type].map(async (time, no) => {
      await modelTask.create({time: time, schedule_id: scheduleId, data: {
        kebiaoType: type,
        courseNo: no
      }});
    });

  });
};
