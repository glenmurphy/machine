import Operator from '../../operator.mjs';

export default class Neq extends Operator {
  static type = 'NEQ';
  static letter = '!';
  static description = "Checks if a doesn't equal b";

  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    this.outputs['c'].setNextValue((a != b) ? 1 : 0);
  }
}

Operator.registerOperator(Neq);