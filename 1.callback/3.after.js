

const fs = require('fs');
let school = {};

// let index = 0;
// const cb = () => {
//   if (++index === 2) {
//     console.log(school);
//   }
// }

function after(times, callback) {
  return function () {
    if (--times == 0) {
      callback();
    }
  }
}
let cb = after(2, function () {
  console.log(school);
})
fs.readFile('./name.txt', 'utf8', function (err, data) {
  school.name = data;
  cb();
})

fs.readFile('./age.txt', 'utf8', function (err, data) {
  school.age = data;
  cb();
})
