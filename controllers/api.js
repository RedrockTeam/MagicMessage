/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import sender from '../service/multi_thread_sender';
import broadcast from '../socketio/broadcast';
import modelSchedule from '../models/schedule';
import modelTask from '../models/task';
import nodeSchedule from 'node-schedule';
import taskGenerator from '../service/taskGenerator';
import moment from 'moment';

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
  if (!params || !params['openid']) {
    return ctx.body = {
      status: 1,
      info: 'openid null'
    };
  }
  if (!params || !params['remindTs']) {
    return ctx.body = {
      status: 1,
      info: 'remindTs null'
    };
  }

  const schedule = await modelSchedule.create({
    openid: params['openid'],
    template_id: 'zSA4pm2qqMbA4el7GWCE75oRM1V340hwqiGUv7LmJ7Q',
    type: 'remind',
    data: {
      event: params['event']
    }
  });
  const paramDate = moment(parseInt(params['remindTs']));
  const task = await modelTask.create({
    date: paramDate.format('YYYY-MM-DD'),
    time: paramDate.format('HH:mm'),
    schedule_id: schedule.id,
    data: { type: 'remind' }
  });

  return ctx.body = {
    status: 0,
    info: 'ok',
    taskId: task.id
  };
};

/**
 * status
 * @param ctx
 * @param next
 */
exports.status = async function(ctx, next) {
  const param = ctx.request.body;
  if (!param || !param['openid']) {
    return ctx.body = {
      status: 400,
      info: 'openid not valid'
    };
  }
  const openid = param.openid;
  const schedule = await modelSchedule.findOne({where: {openid: openid}});
  let everyClass = false, everyDay = false;
  if (!schedule) {
    // false and false
  } else if (schedule.data['type'] == 'everyClass') {
    everyClass = true;
  } else if (schedule.data['type'] == 'everyDay') {
    everyDay = true;
  }

  return ctx.body = {
    status: 0,
    info: 'ok',
    data: {
      everyDay: everyDay,
      everyClass: everyClass
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

/**
 * 即时消息
 * @param ctx
 * @param next
 */
import templateSender from '../service/sendModelTemplateHttp';
exports.instantMessage = async function(ctx, next) {
  const param = ctx.request.body;
  if (!param['openid'] || !param['message']) {
    return ctx.body = {
      status: 1,
      info: 'param invalid'
    };
  }
  const sender = param['sender'] || '匿名';
  const tid = 'vJ2Sf-qkhB9rXPqeMRx1JzjsD03xg7g6dfSx0EYnWtc';
  const data = {
    "first": {
      "value": "有人发给你一个新的悄悄话",
      "color": "#173177"
    },
    "keyword1": {
      "value": sender,
      "color": "#173177"
    },
    "keyword2": {
      "value": moment().format('YYYY-MM-DD HH:mm:ss'),
      "color": "#FF0099"
    },
    "remark": {
      "value": param['message'],
      "color": "#173177"
    }
  };

  templateSender(param['openid'], tid, param['url'] || '', '#FF0000', data);
};
