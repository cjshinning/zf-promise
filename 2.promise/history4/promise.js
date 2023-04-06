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

// resolvePromise 所有的promise都要兼容 bluebird q es6-promise
const resolvePromise = (promise2, x, resolve, reject) => {
  //  1.循环引用，自己等待自己完成 错误实现
  if (promise2 === x) { //用一个类型错误，结束掉promise
    return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
  }
  // 后续的条件要严格判断 保证代码能和别的库一起使用
  let called;
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {  //有可能是一个promise
    // 要继续判断
    try {
      let then = x.then;
      if (typeof then === 'function') { //只能认为是一个promise了
        // 不要写成x.then 直接then.call就可以了，因为x.then可能会报错
        then.call(x, y => { //根据promise的状态决定是成功还是失败
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject); //递归解析过程
        }, e => {
          if (called) return;
          called = true;
          reject(e)
        });
      } else {  //{then:123}
        resolve(x);
      }
    } catch (e) { //防止失败了再次进入成功
      if (called) return;
      called = true;
      reject(e);  //取值出错
    }
  } else {
    resolve(x);
  }
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
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
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

// promise的延迟对象
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })

  return dfd;
}

// npm install promises-aplus-tests -g
// promises-aplus-tests promise.js
module.exports = Promise;