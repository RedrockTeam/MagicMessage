/**
 * Created at 16/4/26.
 * @Author Ling.
 * @Email i@zeroling.com
 */
export default class TaskQueue {
  constructor(limit) {
    this.waiting = [];
    this.running = [];
    this.limit = Number(limit) || 10; // 并发数量
  }

  run(fn) {
    this.waiting.push(fn);
    this.next();
  }

  next() {
    if (this.running.length < this.limit) {
      const currentTask = this.waiting.shift();
      if (typeof currentTask === 'function') {
        this.running.push(currentTask);
        (async () => {
          await currentTask();
          this.running.splice(this.running.indexOf(currentTask), 1);

          if (this.waiting.length) { // 这个异步任务执行完之后去执行下一个任务
            this.next();
          }
        })();
      }
    }
  }
}
