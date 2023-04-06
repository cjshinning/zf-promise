class Subject {
  constructor(name) {
    this.name = name;
    this.state = '开心的';
    this.observers = []
  }
  attach(o) {
    this.observers.push(o);
  }
  setState(newState) {
    this.state = newState;
    this.observers.forEach(o => o.update(this));
  }
}
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(baby) {
    console.log(`当前${this.name}被通知了，当前小宝宝的状态是${baby.state}`);
  }
}

let baby = new Subject('小宝宝');
let father = new Observer('爸爸');
let mother = new Observer('妈妈');
baby.attach(father);
baby.attach(mother);
baby.setState('被欺负了');