const Promise = require('./promise');

let p = new Promise((resolve, reject) => {
  resolve(1);
})

let promise2 = p.then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(2000);
        }, 1000)
      }));
    }, 1000)
  })
})

promise2.then((data) => {
  console.log(data)
}, err => {
  console.log(err); //TypeError: Chaining cycle detected for promise #<Promise>
})
