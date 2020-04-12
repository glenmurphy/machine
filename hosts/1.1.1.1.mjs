// time
import {Host} from '../core/host.mjs';

export default class Time extends Host {
  static address = '1.1.1.1';

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
    var hours = String(new Date().getHours());
    if (hours.length < 2) hours = '0' + hours;

    var minutes = String(new Date().getMinutes());
    if (minutes.length < 2)  minutes = '0' + minutes;

    this.setData([
      hours.charAt(0),
      hours.charAt(1),
      minutes.charAt(0),
      minutes.charAt(1)
    ]);
    
    this.echoTimeout = null;
  }

  operatorDisconnect(operator) {
    clearTimeout(this.echoTimeout);
    this.echoTimeout = null;
  }
}