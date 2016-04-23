/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 */
// 生成 task callback
import _ from 'lodash';
import sendModelTemplateHttp from './sendModelTemplateHttp';
import getKebiaoInfo from './getKebiaoInfo';

function GenText(s) {
  const text = s['params']['text'];
  return async function () {
    await sendModelTemplateHttp(s['openid'], s['template_id'], s['data']['url'] || '', s['data']['topColor'] || '#FF0000', s['data']);
  }
}

async function GenKebiao(schedule, task) {
  const openid = schedule['openid'];
  const url = schedule['data']['url'] || task['data']['url'] || `http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/CourseTable/CourseTable/index/openid/${openid}/token/gh_68f0a1ffc303.html`;
  const kebiaoInfo = await getKebiaoInfo(openid);
  if (schedule['data']['type'] === 'everyClass') {
    const courseNo = task['data']['courseNo'];
    const kebiao = JSON.parse(kebiaoInfo.course);
    const nowWeek = kebiao['nowWeek'];
    const hash_today = ((new Date).getDay() + 6) % 7;
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
    // todo ...
  }
  return function() {};
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
    case 'text':
          return GenText(schedule, task);
    case 'kebiao':
          return await GenKebiao(schedule, task);
  }
  return function() {
    console.log('nothing matched');
  };
}
