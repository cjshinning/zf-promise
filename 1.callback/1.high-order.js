// 什么是高阶函数：
// 1.如果一个函数的参数是一个函数（回调函数就是一种高阶函数）
// 2.如果一个函数返回一个函数，当前这个函数也是一个高阶函数

// 写了一个业务代码，扩展当前代码
function say(a, b) {
  console.log('say', a, b);
}

Function.prototype.before = function (callback) {
  return (...args) => {
    callback();
    this(...args);
  }
}

let beforeSay = say.before(function () {
  console.log('before say');
})

beforeSay('hello', 'world');
