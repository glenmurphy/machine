import Operator from '../../operator.mjs';

export default class Div extends Operator {
  static type = 'DIV';
  static letter = '/';
  static description = "";

  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = Number(this.inputs['a'].value);
    var b = Number(this.inputs['b'].value);
    this.outputs['c'].setNextValue(a / b);
  }
}

Operator.registerOperator(Div);