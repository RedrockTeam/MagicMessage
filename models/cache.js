/**
 * Created at 16/4/23.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import DB from './connection';

const Cache = DB.define('cache', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  type: Sequelize.STRING(30),
  key: Sequelize.STRING(100),
  expire: Sequelize.STRING(50),
  data: {
    type: Sequelize.STRING(5000),
    get: function()  {
      const data = this.getDataValue('data');
      try {
        const obj = JSON.parse(data);
        return obj;
      } catch(e) {
        return {};
      }
    },
    set: function(val) {
      this.setDataValue('data', JSON.stringify(val));
    }
  }
});

Cache.sync().then(() => {
  console.log('table cache synced');
});

export default Cache;
