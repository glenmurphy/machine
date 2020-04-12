// Echo host - echos input back one second later
//
// Ideally we make this a singleton and it echos across all 
// connected clients; might be too powerful though since it 
// would offer data teleportation, so would need to combine
// with the economy system
import {Host} from '../core/host.mjs';

export default class Echo extends Host {
  static address = '1.1.1.2';

  constructor(operator) {
    super(operator);
    this.setConnected();
  }

  input(input) {
    setTimeout(this.echo.bind(this, input), 1000);
  }

  echo(input) {
    this.appendData([input]);
  }
}