import Operator from '../../operator.mjs';

export default class Eq extends Operator {
  static type = 'EQ';
  static letter = '=';
  static description = "Checks if both inputs are equal";
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    this.queueOutput('c', (a == b) ? 1 : 0);
  }
}

Operator.registerOperator(Eq);