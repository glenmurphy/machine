import Operator from '../../operator.mjs';

export default class Await extends Operator {
  static type = 'AWAIT';
  static letter = 'A';
  static description = 'Waits until both inputs are present, then copies them one row down'
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', -1, +1);
    this.addOutput('d', +1, +1);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');
    if (a != undefined && b != undefined) {
      this.queueOutput('c', a);
      this.queueOutput('d', b);
    }
  }
}

Operator.registerOperator(Await);