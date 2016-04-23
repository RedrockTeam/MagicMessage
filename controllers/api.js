/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import sender from '../service/multi_thread_sender';
import broadcast from '../socketio/broadcast';
import modelSchedule from '../models/schedule';
import nodeSchedule from 'node-schedule';
import taskGenerator from '../service/taskGenerator';

/**
 * 群发 HTTP 请求
 * @param ctx
 * @param next
 */
exports.multi = function(ctx, next) {
  const reqOpts = (new Array(50)).fill(0).map(x => ({
    method: 'get',
    uri: 'http://localhost:3000'
  }));
  const option = {

  };
  sender(reqOpts, option, (id, body) => {
    broadcast('info', {id, body});
  });

  ctx.body = {
    status: 0,
    info: 'ok'
  };
};

/**
 * 添加一个 schedule
 * @param ctx
 * @param next
 * @returns {*}
 */
exports.addSchedule = async function(ctx, next) {
  const params = ctx.request.body;
  if (!params && params['openid']) {
    return ctx.body = {
      status: 1,
      info: 'openid null'
    };
  }

  // crontab 格式参照 https://www.npmjs.com/package/node-schedule
  if (!params && params['crontab']) {
    return ctx.body = {
      status: 1,
      info: 'crontab null'
    };
  }

  if (!params && params['template_id']) {
    return ctx.body = {
      status: 1,
      info: 'template_id null'
    };
  }

  const record = await modelSchedule.build({
    openid: params['openid'],
    crontab: params['crontab'],
    template_id: params['template_id'],
    type: params['type'] || 'text'
  }).save();
  nodeSchedule.scheduleJob(params['crontab'], taskGenerator(record));

  return ctx.body = {
    status: 0,
    info: 'ok'
  };
};

/**
 * status
 * @param ctx
 * @param next
 */
exports.status = async function(ctx, next) {
  return ctx.body = {
    status: 0,
    info: 'ok',
    data: {
      everyDay: true,
      everyClass: false
    }
  }
};

import kebiaoRegister from '../service/kebiaoRegister';
exports.updateState = async function(ctx, next) {
  const param = ctx.request.body;
  if (!param || !param['openid'] || !param['type']) {
    return ctx.body = {
      status: 400,
      info: 'param not valid'
    };
  }
  console.log(param);
  if ('true' == param['everyDay']) {
    await kebiaoRegister(param['openid'], 'everyDay');
  } else if ('true' == param['everyClass']) {
    await kebiaoRegister(param['openid'], 'everyClass');
  } else {
    await kebiaoRegister(param['openid'], 'none');
  }
  return ctx.body = {
    status: 0,
    info: 'ok'
  }
};
