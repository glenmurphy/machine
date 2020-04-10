import Operator from '../../operator.mjs';

export default class LT extends Operator {
  static type = 'LT';
  static letter = '<';
  static description = "Checks if a is less than b";

  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    if (a < b) 
      this.outputs['c'].setNextValue(1);
    else
      this.outputs['c'].setNextValue(0);
  }
}

Operator.registerOperator(LT);