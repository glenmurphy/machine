import Operator from '../../operator.mjs';

export default class And extends Operator {
  static type = 'AND';
  static letter = '&';
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    if (a != 0 && b != 0) 
      this.queueOutput('c', 1);
    else
      this.queueOutput('c', 0);
  }
}

Operator.registerOperator(And);