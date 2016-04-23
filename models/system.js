/**
 * Created at 16/4/16.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import DB from './connection';

const System = DB.define('system', {
  key: Sequelize.STRING(100),
  value: Sequelize.STRING(200)
});

System.sync().then(() => {
  console.log('table system synced');
});

export default System;
