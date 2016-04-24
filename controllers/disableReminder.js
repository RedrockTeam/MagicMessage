/**
 * Created at 16/4/22.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import modelSchedule from '../models/schedule';
import modelTask from '../models/task';

export default async function (ctx, next) {
  const openid = ctx.params.openid;
  const taskId = ctx.params.task_id;
  if (!openid || !taskId) {
    return ctx.body = {
      status: 1,
      info: 'openid or taskId not valid'
    }
  }

  const task = await modelTask.findById(taskId);
  const desc = 'canceled' === task.time ? '已经取消过了' : `不会再在 ${task.date} ${task.time} 提醒你了`;
  if (task) {
    await task.update({ time: 'canceled' });
  }
  return await ctx.render('disableReminder', {
    desc: desc
  });
}
