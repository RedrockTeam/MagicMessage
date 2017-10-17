/**
 * Created at 16/4/23.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import request from 'request-promise';
import modelCache from '../models/cache';

export default async function(openid) {
  const url = `https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/CourseTable/CourseTable/json/openid/${openid}/token/gh_68f0a1ffc303.html`;
  const kbInDb = modelCache.findOne({where: {
    type: 'kebiao',
    key: openid
  }});
  if (kbInDb && parseInt(kbInDb['expire']) > +new Date) {
    return kbInDb['data'];
  }

  const remoteStr = await request(url);
  const remote = JSON.parse(remoteStr);
  if (remote && remote['info'] === 'success') {
    const val = {
      type: 'kebiao',
      key: openid,
      expire: +new Date + 7 * 24 * 3600 * 1000,
      data: remote['data']
    };
    modelCache.findOrCreate({
      where: {type: 'kebiao', key: openid},
      defaults: val
    }).spread(async (kb, created) => {
      if (!created) {
        await kb.update(val);
      }
    });
    return remote['data'];
  }
}
