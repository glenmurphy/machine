import Operator from '../../operator.mjs';
import * as Chars from './chars.mjs';

export default class Write extends Operator {
  static type = 'WRITE';
  static letter = 'W';
  static description = "Writes to the grid"
  
  init() {
    this.addInput('o', -1, 0);
    this.addInput('x', +1, 0);
    this.addInput('y', +2, 0);
  }
  
  process() {
    var o = this.getInput('o');
    var x = this.getInput('x');
    var y = this.getInput('y');

    if (o !== null && x !== null && y !== null )
    if (Chars.fromCode(code)) {
      this.data = [Chars.fromCode(code)];
    }
    this.queueClearInput('a');
  }
}

Operator.registerOperator(VFD);