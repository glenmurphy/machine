import Operator from '../../operator.mjs';

export default class Filter extends Operator {
  static type = 'FLT';
  static letter = 'F';
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', 1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var b = this.getInput('b');
    if (b == 1)
      this.queueOutput('c', this.getInput('a'));
  }
}

Operator.registerOperator(Filter);