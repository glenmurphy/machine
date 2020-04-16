import Operator from '../../operator.mjs';
import * as Chars from './chars.mjs';

export default class VFD extends Operator {
  static type = 'VFD';
  static letter = '#';
  static description = "Displays a char"
  
  init() {
    this.addInput('a', 0, 0);
  }

  process() {
    var code = this.getInput('a');
    if (Chars.fromCode(code)) {
      this.data = [Chars.fromCode(code)];
    }
    this.queueClearInput('a');
  }
}

Operator.registerOperator(VFD);