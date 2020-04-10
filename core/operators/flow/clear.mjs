import Operator from '../../operator.mjs';

export default class Clear extends Operator {
  static type = 'CLR';
  static letter = '_';
  
  init() {
    this.addInput('a', 0, 0);
  }

  process() {
    this.queueClearInput('a');
  }
}

Operator.registerOperator(Clear);