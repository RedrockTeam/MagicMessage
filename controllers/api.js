/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import sender from '../service/multi_thread_sender';
import broadcast from '../socketio/broadcast';

exports.multi = function(ctx, next) {
  const reqOpts = (new Array(50)).fill(0).map(x => ({
    method: 'get',
    uri: 'http://localhost:3001'
  }));
  const option = {

  };
  sender(reqOpts, option, (id, body) => {
    broadcast('ack', {id, body});
  });

  ctx.body = "fine";
};
