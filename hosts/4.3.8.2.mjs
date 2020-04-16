// time
import {Host} from '../core/host.mjs';
import * as Chars from '../core/operators/io/chars.mjs'

export default class Output_4_3_8_2 extends Host {
  static address = '4.3.8.2';

  constructor(operator) {
    super(operator);

    // simulate lag
    setTimeout(this.setConnected.bind(this), 500);
  }

  input(input) {
    if (!this.echoTimeout)
      this.echoTimeout = setTimeout(this.echoTime.bind(this), 1000);
  }

  echoTime() {
    var output = "hELLO. HELLO?";
    
    this.setData(Chars.stringToCodes(output));
    
    this.echoTimeout = null;
  }

  operatorDisconnect(operator) {
    clearTimeout(this.echoTimeout);
    this.echoTimeout = null;
  }
}