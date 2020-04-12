import Operator from '../../operator.mjs';

export default class Buffer extends Operator {
  static type = 'BUF';
  static letter = 'B';
  static description = "FIFO queue"
  
  // aBb
  //  c
  //
  // reads data from 'a' into internal data
  // outputs data on c when b is 1

  init() {
    this.addInput('a', -1, 0);
    this.addInput('b', +1, 0);

    this.addOutput('c', 0, +1);
  }

  validateInputs() {
    return (typeof this.getInput('a') != 'undefined' || this.getInput('b'))
  }

  get full() {
    return (this.data.length >= 100);
  }

  process() {
    var a = this.getInput('a');
    var b = this.getInput('b');

    if (typeof a != 'undefined' && !this.full) {
      this.data.push(a);
    }

    if (b == '1' && this.data.length > 0) {
      this.queueOutput('c', this.data.shift());
    }
  }
}

Operator.registerOperator(Buffer);