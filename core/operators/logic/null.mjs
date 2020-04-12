import Operator from '../../operator.mjs';

export default class Null extends Operator {
  static type = 'NULL';
  static letter = '~';
  static description = "Checks if input is null";
  
  init() {
    this.addInput('a', -1, 0);
    this.addOutput('c', 0, +1);
  }

  validateInputs() { return true; }
  
  process() {
    var a = this.getInput('a');
    this.queueOutput('c', (typeof a == 'undefined' || a === null) ? 1 : 0);
  }
}

Operator.registerOperator(Null);