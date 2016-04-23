/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import DB from './connection';

const Task = DB.define('task', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.STRING(30),
    defaultValue: ''
  },
  time: Sequelize.STRING(30),
  schedule_id: Sequelize.INTEGER.UNSIGNED,
  data: {
    type: Sequelize.STRING(200),
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

Task.sync().then(() => {
  console.log('table Task synced');
});

export default Task;
