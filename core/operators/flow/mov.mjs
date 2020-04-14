import Operator from '../../operator.mjs';

export default class Mov extends Operator {
  static type = 'MOV';
  static letter = '.';
  static description = "Moves data"
  
  init() {
    this.addInput('a', 0, 0);
    this.addOutput('c', 0, -1);
  }

  process() {
    this.queueOutput('c', this.getInput('a'));
    this.queueClearInput('a');
  }
}

Operator.registerOperator(Mov);