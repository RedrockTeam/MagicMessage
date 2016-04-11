/**
 * Created at 16/4/11.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import fs from 'fs';
import { isPlainObject } from 'lodash';
const defaultConfig = {
  port: 3001
};
const cfgs = [defaultConfig];
fs.readdirSync(__dirname).map(filename => {
  if (filename === 'index.js') {
    return false;
  }
  try {
    const cfg = require('./' + filename);
    if (isPlainObject(cfg)) {
      defaultConfig.push(cfg);
    }
  } catch (e) {}
});

const config = Object.assign.apply(Object, cfgs);
export default config
