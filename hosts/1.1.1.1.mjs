// time
import {Host} from '../core/host.mjs';

export default class Time extends Host {
  constructor(operator) {
    super(operator);
    this.setConnected();
    this.echoInterval = setInterval(this.echoTime.bind(this), 1000);
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
  }

  operatorDisconnect(operator) {
    clearInterval(this.echoInterval);
  }
}