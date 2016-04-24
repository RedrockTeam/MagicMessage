/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 */
// 生成 task callback
import moment from 'moment';
import sendModelTemplateHttp from './sendModelTemplateHttp';
import getKebiaoInfo from './getKebiaoInfo';

async function GenText(schedule, task) {
  const openid = schedule.openid;
  const tid = schedule.template_id;
  const url = '';
  const params = schedule.data;
  const data = {
    "first": {
      "value": "👏小帮手提醒你干活啦!",
      "color": "#173177"
    },
    "keyword1": {
      "value": params['event'],
      "color": "#FF0099"
    },
    "keyword2": {
      "value": '你自己',
      "color": "#173177"
    },
    "keyword3": {
      "value": moment(schedule['createdAt']).format('YYYY-MM-DD HH:mm:ss'),
      "color": "#173177"
    },
    "remark": {
      "value": '加油↖(^ω^)↗',
      "color": "#173177"
    }
  };
  return async function () {
    await sendModelTemplateHttp(openid, tid, url, '#FF0000', data);
  }
}

async function GenKebiao(schedule, task) {
  const openid = schedule['openid'];
  const url = schedule['data']['url'] || task['data']['url'] || `http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/CourseTable/CourseTable/index/openid/${openid}/token/gh_68f0a1ffc303.html`;
  const kebiaoInfo = await getKebiaoInfo(openid);
  const kebiao = JSON.parse(kebiaoInfo.course);
  const nowWeek = kebiao['nowWeek'];
  const hash_today = ((new Date).getDay() + 6) % 7;
  if (schedule['data']['type'] === 'everyClass') {
    const courseNo = task['data']['courseNo'];
    const course = kebiao['data'].filter(kb => {
      if (kb['hash_day'] != hash_today) return false;
      if (kb['hash_lesson'] != courseNo) return false;
      if (kb['week'].indexOf(nowWeek) == -1) return false;
      return true;
    });
    if (course[0]) {
      const data = {
        "first": {
          "value": "👏你有以下课程将在10分钟后开始!",
          "color": "#173177"
        },
        "keyword1": {
          "value": course[0]['course'],
          "color": "#FF0099"
        },
        "keyword2": {
          "value": `${course[0]['rawWeek']} ${course[0]['day']} ${course[0]['lesson']}`,
          "color": "#173177"
        },
        "keyword3": {
          "value": `${course[0]['period']}课时`,
          "color": "#173177"
        },
        "keyword4": {
          "value": course[0]['teacher'],
          "color": "#173177"
        },
        "remark": {
          "value": `教室: ${course[0]['classroom']}`,
          "color": "#FF0099"
        }
      };
      return async function() {
        await sendModelTemplateHttp(openid, schedule['template_id'], url, '#FF0000', data);
      }
    } else {
      return () => {};
    }
  } else if (schedule['data']['type'] === 'everyDay') {
    const courseNames = kebiao['data'].filter(kb => {
      let tomorrow_day = hash_today == 6 ? 0 : hash_today + 1;
      let tomorrow_week = hash_today == 6 ? nowWeek + 1 : nowWeek;
      if (kb['hash_day'] == tomorrow_day && kb['week'].indexOf(tomorrow_week) > -1) {
        return kb['course'];
      }
      return false;
    });
    const data = {
      "first": {
        "value": "👏明天的课程安排如下",
        "color": "#173177"
      },
      "keyword1": {
        "value": moment().locale('zh-cn').add(1, 'day').format('YYYY年MM月DD日 dddd'),
        "color": "#FF0099"
      },
      "keyword2": {
        "value": courseNames.join('，') || '没有课',
        "color": "#FF0099"
      },
      "remark": {
        "value": `好好学习天天向上~`,
        "color": "#173177"
      }
    };
    return async function() {
      await sendModelTemplateHttp(openid, schedule['template_id'], url, '#FF0000', data);
    }
  }
  return async function() {};
}

/**
 * 任务分发器
 * @param schedule
 * @param task
 * @returns {Function}
 */
export default async function(schedule, task) {
  // s 是 schedule 表中的每一 row
  switch (schedule['type']) {
    case 'remind':
          return await GenText(schedule, task);
    case 'kebiao':
          return await GenKebiao(schedule, task);
  }
  return async function() {
    console.log('nothing matched');
  };
}
