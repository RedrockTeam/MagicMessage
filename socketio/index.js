/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import socketStore from './socket_pool';

function ioConnectionHandler(socket) {
  socketStore.add(socket);
  console.log(socket.id, 'socket connected');
  socket.on('disconnect', () => {
    socketStore.delete(socket);
  });
  socket.emit('ack', {b: 2});
}

module.exports = ioConnectionHandler;

