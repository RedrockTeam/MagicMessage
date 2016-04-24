/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import request from 'request-promise';
import getAccessToken from './getAccessToken';
import moment from 'moment';

export default async function(touser, templateId, url, topColor = "#FF0000", data = {}) {
  const accessToken = await getAccessToken();
  const $return = await request({
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + accessToken,
    body: {
      touser: touser,
      template_id: templateId,
      url: url,
      topcolor: topColor,
      data: data
    },
    json: true
  });
  if ($return && $return['errcode'] == 0) {
    console.log(`${moment()}给openid: ${touser} 的模板消息发送成功`);
  }
  return $return;
}
