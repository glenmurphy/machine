import Operator from '../../operator.mjs';

export default class Copy extends Operator {
  static type = 'Copy';
  static letter = 'C';
  
  init() {
    this.addInput('a', -1, 0);
    this.addOutput('b', +1, 0);
  }

  process() {
    var a = this.getInput('a');
    this.queueOutput('b', a);
  }
}

Operator.registerOperator(Copy);