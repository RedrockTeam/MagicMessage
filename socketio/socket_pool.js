/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
const pool = new Set();

exports.has = function(socket) {
  return pool.has(socket);
};

exports.add = function(socket) {
  return pool.add(socket);
};

exports.delete = function(socket) {
  return pool.delete(socket);
};

exports.getSet = function() {
  return pool;
};
