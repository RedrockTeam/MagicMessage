/**
 * Created at 16/4/11.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import request from 'request-promise';

export default function(reqArr, option = {}, cb) {
  const threadNum = parseInt(option.threadNum) || 10; // 并发量
  const retryLimit = parseInt(option.retryLimit) || 10; // 最大重试次数

  const pool = reqArr.map((reqOpt, id) => {
    reqOpt._id = id;
    return reqOpt;
  }); //(new Array(threadNum)).fill(0).map((v, i) => i);
  function getOptFromPool() {
    return pool.shift();
  }

  function send(reqOpt, retry) {
    reqOpt = reqOpt || getOptFromPool();
    if (undefined === reqOpt) {
      return;
    }
    const id = reqOpt._id;
    console.log(`req id is ${id}`);
    request(reqOpt).then(data => {
      cb && cb(id, data);
      console.log(`${id} success`);
      send();
    }).catch(e => {
      retry = retry === undefined ? 1 : retry;
      if (retry > retryLimit) {
        console.log(`error in id ${id}, error: ${e}, retry times reach max. stop retrying.`);
        send();
      } else {
        console.log(`error in id ${id}, error: ${e}, ready for retry, retry times: ${retry}`);
        send(reqOpt, retry + 1);
      }
    });
  }

  for (let i = 0; i < threadNum; i++) {
    send();
  }
}
