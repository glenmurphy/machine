import Operator from '../../operator.mjs';

export default class Rnd extends Operator {
  static type = 'RND';
  static letter = 'R';
  static description = "";
  
  init() {
    this.addInput('min', -1, 0);
    this.addInput('max', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = Number(this.getInput('min'));
    var b = Number(this.getInput('max')); 
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    var output = Math.floor(Math.random() * (max - min + 1)) + min;
    this.outputs['c'].setNextValue(output);
  }
}

Operator.registerOperator(Rnd);