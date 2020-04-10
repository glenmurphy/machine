import Operator from '../../operator.mjs';

export default class Or extends Operator {
  static type = 'OR';
  static letter = '|';
  static description = "Checks if a or b are true";
  
  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);
    this.addOutput('c', 0, +1);
  }

  process() {
    var a = this.inputs['a'].value;
    var b = this.inputs['b'].value;
    if (a != 0 || b != 0) 
      this.outputs['c'].setNextValue(1);
    else
      this.outputs['c'].setNextValue(0);
  }
}

Operator.registerOperator(Or);