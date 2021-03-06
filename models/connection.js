/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Sequelize from 'sequelize';
import { db } from '../config';

const option = {
  host: db.host || 'localhost'
};
if (db.logging === false) {
  option.logging =  false;
}

const con = new Sequelize(db.database, db.username, db.password, option);
console.log('DB Connected!');
export default con;
