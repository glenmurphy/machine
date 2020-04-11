// time
import {Host} from '../core/host.mjs';

export default class Echo extends Host {
  constructor(operator) {
    if (singleton) return singleton;

    super(operator);
    this.setConnected();
  }

  input(input) {
    setTimeout(this.echo.bind(this, input), 1000);
  }

  echo(input) {
    this.appendData([input]);
  }

  operatorDisconnect(operator) {
    clearInterval(this.echoInterval);
  }
}