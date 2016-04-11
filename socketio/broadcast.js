/**
 * Created at 16/4/12.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import socketStore from './socket_pool';

export default function broadcast(msg, obj) {
  const socketSet = socketStore.getSet();
  for (let s of socketSet) {
    s.emit(msg, obj);
  }
}
