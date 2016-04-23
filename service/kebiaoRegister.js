/**
 * Created at 16/4/22.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import modelSchedule from '../models/schedule';
import modelTask from '../models/task';

const Times = {
  everyDay: ['7:45'],
  everyClass: ['7:50', '9:50', '13:50', '15:55', '18:50', '20:40'],
  none: []
};

export default async function(openid, type) {
  modelSchedule.findOrCreate({
    where: {openid: openid},
    defaults: { openid: openid, template_id: "XgBPsF4rb4A0GUkoP-WgsFwhVUpgKv8G1SMevcKLWLc", type: 'kebiao', data: {type: type} }
  }).spread(function(schedule, created) {
    if (!created) {
      schedule.update({
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
