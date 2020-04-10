import Operator from '../../operator.mjs';

export default class Eq extends Operator {
  static type = 'Eq';
  static letter = '=';
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    this.outputs['c'].setNextValue((a == b) ? 1 : 0);
  }
}

Operator.registerOperator(Eq);