
function isType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}
const currying = (fn, arr = []) => {
  let len = fn.length;
  return function (...args) { //高阶函数
    let concatValue = [...arr, ...args];
    if (concatValue.length < len) {
      return currying(fn, concatValue); //递归不停的产生函数
    } else {
      return fn(...concatValue);
    }
  }
}
let isArray = currying(isType)('Array');
let isString = currying(isType)('String');
console.log(isArray([]));
console.log(isArray('123'));

// function sum(a, b, c, d, e, f) {
//   return a + b + c + c + d + e + f;
// }

// let r = sum(1, 2)(3, 4)(5)(6)
