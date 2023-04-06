let fs = require('fs');

function read(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    })
  })
}
// 1.promise 成功和失败的回调的返回值 可以传递到外层的下一个then
// 2.如果返回的是普通值的话（传递到下一次的成功中），可能还有promise的情况、出错的情况
// 3.错误处理，如果离自己最近的then没有错误处理，会向下找
// 4.每次执行完promise.then方法后返回都是一个新的promise
read('./name.txt').then((data) => {
  return read(data);
}).then((data) => {
  console.log('-----success-----', data);
}, err => {
  console.log('------error----', err + '错误');
})


// err first 错误第一，异步方法无法通过try、catch捕获异常
// fs.readFile('./name.txt', 'utf8', (err, data) => {
//   fs.readFile(data, 'utf8', (err, data) => {
//     console.log(data);
//   })
// })