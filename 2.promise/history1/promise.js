// promise就是一个类
// 1、promise有三个状态：成功态（resolve）失败态（reject）等待态（pending）
// 2、用户自己觉得失败的原因和成功的原因 成功和失败也是用户自己定义的
// 3、promise 默认执行器时立即执行
// 4、promise的实例都拥有一个then方法，一个参数是成功的回调，另一个失败的回调
// 5、如果执行函数时发生了异常也会执行失败逻辑
// 6.如果promise一旦成功就不能失败，反过来也是一样

const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';
const PENDING = 'PENDING';
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = RESOLVED;
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
      }
    }
    try {
      executor(resolve, reject); //立即执行
    } catch (e) { // 错误直接走错误逻辑
      reject(e)
    }
  }
  then(onFulfilled, unRejected) {
    if (this.status == RESOLVED) {
      onFulfilled(this.value);
    }
    if (this.status == REJECTED) {
      unRejected(this.reason);
    }
  }
}

module.exports = Promise;