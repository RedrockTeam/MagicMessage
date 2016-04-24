/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import { db } from '../config';

const con = new Sequelize(db.database, db.username, db.password, {
  host: db.host || 'localhost',
  logging: false
});
console.log('DB Connected!');
export default con;
