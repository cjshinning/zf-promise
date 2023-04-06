
let Promise = require('./promise');
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('成功');
    reject('失败');
  }, 1000);
})
// 1.promise调用then方法时可能当前的promise并没有成功，状态是pending
// 2.发布订阅模式，如果当前状态是pending时，我们需要将成功的回调和失败的回调存放起来，稍后调用resolve或者reject
promise.then((data) => {
  console.log('success1', data)
}, (err) => {
  console.log('faild1', err);
})

promise.then((data) => {
  console.log('success2', data)
}, (err) => {
  console.log('faild2', err);
})
