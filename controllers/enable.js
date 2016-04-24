/**
 * Created at 16/4/22.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Schedule from '../models/schedule';
import Sequelize from 'sequelize';

export default async function (ctx, next) {
  // Schedule.findAll().then(schedules => {
  //   console.log(schedules);
  // });
  const openid = ctx.params.openid;
  if (!openid) {
    return ctx.body = "openid not shown";
  }
  await ctx.render('enable');
}
