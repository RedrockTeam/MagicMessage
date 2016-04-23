/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import DB from './connection';

const Schedule = DB.define('schedule', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: Sequelize.STRING(40),
    allowNull: false
  },
  template_id: Sequelize.STRING(50),
  type: {
    type: Sequelize.STRING(15),
    defaultValue: "fixed"
  },
  data: {
    type: Sequelize.STRING(2000),
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

Schedule.sync().then(() => {
  console.log('table schedule synced');
});

export default Schedule;
