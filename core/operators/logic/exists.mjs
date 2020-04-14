import Operator from '../../operator.mjs';

// This is a shortcut logic operator in that it can be implemented with null (~) and a !, but that
// case might be less common than this one, so we're including it for now
export default class Exists extends Operator {
  static type = 'EXIST';
  static letter = '?';
  static description = "Checks if input is not null";
  
  init() {
    this.addInput('a', -1, 0);
    this.addOutput('c', 0, +1);
  }

  validateInputs() { return true; }
  
  process() {
    var a = this.getInput('a');
    this.queueOutput('c', (typeof a == 'undefined' || a === null) ? 0 : 1);
  }
}

Operator.registerOperator(Exists);