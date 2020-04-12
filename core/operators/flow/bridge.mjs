import Operator from '../../operator.mjs';

export default class Bridge extends Operator {
  static type = 'BRG';
  static letter = ',';
  static description = "Moves data two cells"
  
  init() {
    this.addInput('a', 0, 0);
    this.addOutput('c', 0, -2);
  }

  process() {
    this.queueClearInput('a');
    this.queueOutput('c', this.getInput('a'));
  }
}

Operator.registerOperator(Bridge);