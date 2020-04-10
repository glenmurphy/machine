import Operator from '../../operator.mjs';

export default class Pow extends Operator {
  static type = 'POW';
  static letter = '^';
  static description = "";
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = Number(this.getInput('a'));
    var b = Number(this.getInput('b'));
    this.queueOutput(Math.pow(a, b));
  }
}

Operator.registerOperator(Sub);