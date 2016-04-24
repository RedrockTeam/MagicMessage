/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Schedule from '../models/schedule';
import Sequelize from 'sequelize';

export default async function (ctx, next) {
  // Schedule.findAll().then(schedules => {
  //   console.log(schedules);
  // });
  const openid = ctx.request.query['openid'];
  if (!openid) {

  }
  await ctx.render('index', {
    title: 'koa2 title'
  });
}
