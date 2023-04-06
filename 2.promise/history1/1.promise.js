// 1、多个异步请求并发（希望同步最终的结果） promise.all
// 2、链式异步请求的问题 上一个人的输出是下一个人的输入 Promise的链式调用可以解决这个问题
// 3、缺陷：还是基于回调
let Promise = require('./promise');
let promise = new Promise((resolve, reject) => {
  // throw new Error('失败了');
  resolve('成功');
  reject('失败');
})
promise.then((data) => {
  console.log('success', data)
}, (err) => {
  console.log('faild', err);
})
