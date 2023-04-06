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
const resolvePromise = (promise2, x, resolve, reject) => {
  console.log(promise2, x, resolve, reject);
}
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];  //专门用来存放成功的回调
    this.onRejectedCallbacks = [];  //专门用来存放失败的回调
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = RESOLVED;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    try {
      executor(resolve, reject); //立即执行
    } catch (e) { // 错误直接走错误逻辑
      console.log(e, 'inner');
      reject(e)
    }
  }

  // 1.promise 成功和失败的回调的返回值 可以传递到外层的下一个then
  // 2.如果返回的是普通值的话（传递到下一次的成功中），可能还有promise的情况、出错的情况
  // 3.错误处理，如果离自己最近的then没有错误处理，会向下找
  // 4.每次执行完promise.then方法后返回都是一个新的promise

  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.status == RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        }, 0)
      }
      if (this.status == REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            // todo...
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          // todo...
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          }, 0)
        })
      }


    })
    return promise2;
  }
}

module.exports = Promise;