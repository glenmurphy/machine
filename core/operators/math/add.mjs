import Operator from '../../operator.mjs';

export default class Add extends Operator {
  static type = 'ADD';
  static letter = '+';
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = Number(this.getInput('a'));
    var b = Number(this.getInput('b'));
    this.queueOutput('c', a + b);
  }
}

Operator.registerOperator(Add);