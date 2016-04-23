/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import request from 'request-promise';
import jssha from 'jssha';
import crypto from 'crypto';
import modelSystem from '../models/system';

const token = "gh_68f0a1ffc303";
const url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiAccess_Token";

async function getRemoteAccessToken() {
  const timestamp = Math.floor(+new Date() / 1000);
  const nonceStr = _createNonceStr();
  const secret = _sha1(_sha1(timestamp) + _md5(nonceStr) + 'redrock');
  const remoteBody = await request({
    method: "POST",
    uri: url,
    body: `token=${token}&timestamp=${timestamp}&string=${nonceStr}&secret=${secret}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const remote = JSON.parse(remoteBody);
  if (remote && remote['info'] === 'success') {
    return remote['data'];
  } else {
    return '';
  }
}

export default async function() {
  let accessTokenExpire = await modelSystem.findOne({where: {key: "accessTokenExpire"}});
  if (accessTokenExpire && accessTokenExpire['value'] && parseInt(accessTokenExpire['value']) > +new Date) {
    const accessToken = await modelSystem.findOne({where: {key: "accessToken"}});
    return accessToken['value'];
  }

  const _accessToken = await getRemoteAccessToken();
  if (_accessToken) {
    const atObj = {key: 'accessToken', value: _accessToken};
    modelSystem.findOrCreate({
      where: {key: 'accessToken'},
      defaults: atObj
    }).spread(async (accessToken, created) => {
      if (!created) {
        await accessToken.update(atObj);
      }
    });

    const ateObj = {key: 'accessTokenExpire', value: +new Date + 1800 * 1000};
    modelSystem.findOrCreate({
      where: {key: 'accessTokenExpire'},
      defaults: ateObj
    }).spread(async (accessTokenExpire, created) => {
      if (!created) {
        await accessTokenExpire.update(ateObj);
      }
    });
  }

  return remote['data'];
}


function _createNonceStr() {
  return Math.random().toString(36).substr(2, 15);
}
function _sha1(str) {
  str = String(str);
  let shaObj = new jssha(str, 'TEXT');
  return shaObj.getHash('SHA-1', 'HEX');
}
function _md5(str) {
  str = String(str);
  return crypto.createHash('md5').update(str, 'utf-8').digest('hex');
}
