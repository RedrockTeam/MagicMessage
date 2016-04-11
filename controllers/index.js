/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
export default async function (ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  };

  await ctx.render('index', {
  });
}
