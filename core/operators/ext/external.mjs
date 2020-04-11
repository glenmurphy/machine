import Operator from '../../operator.mjs';
import {getHost} from '../../host.mjs';

export default class External extends Operator {
  static type = 'EXT';
  static letter = 'X';
  static description = 'External interface';

  static STATE = {
    DISCONNECTED : 'Disconnected',
    CONNECTING : 'Connecting',
    CONNECTED : 'Connected',
    ERROR : 'Error'
  }

  // iXaaaal
  //  o
  init() {
    this.addInput('i', -1, 0);

    this.addOutput('o', 0, +1);

    this.addInput('a', 1, 0);
    this.addInput('b', 2, 0);
    this.addInput('c', 3, 0);
    this.addInput('d', 4, 0);

    this.addOutput('l', 5, 0);

    this.resetConnectionState();
  }

  validateInputs() { 
    var a = this.getInput('a');
    var b = this.getInput('b');
    var c = this.getInput('c');
    var d = this.getInput('d');
    var valid = (a && b && c && d);
    
    if (!valid) {
      if (this.connection.host)
        this.disconnect();
      else if (this.connection.state != External.STATE.DISCONNECTED)
        this.resetConnectionState();
      return false;
    }
    return true;
  }

  process() {
    if (this.data.length > 0) {
      this.queueOutput('o', this.data.shift());
    }

    var a = this.getInput('a');
    var b = this.getInput('b');
    var c = this.getInput('c');
    var d = this.getInput('d');
    var address = `${a}.${b}.${c}.${d}`;

    if (this.connection.address != address) {
      this.connect(address);
      return;
    }

    if (!this.connection.host)
      return;

    if (this.getInput('i') != null) {
      this.connection.host.input(this.getInput('i'));
      this.queueClearInput('i');
    }
  }

  resetConnectionState() {
    this.connection = {
      address : '',
      host : '',
      state : External.STATE.DISCONNECTED
    }
    this.data = [];
  }

  disconnect() {
    if (this.connection.host) {
      this.connection.host.operatorDisconnect(this);
      this.queueOutput('l', null);
    }

    this.resetConnectionState();
  }

  hostConnected(host) {
    // Do something with the module.
    this.connection.host = host;
    this.connection.state = External.STATE.CONNECTED;
    this.queueOutput('l', 1);
  }

  hostDisconnected(host) {
    if (host != this.connection.host)
      throw new Error("Host that disconnected was the wrong one");
    this.queueOutput('l', null);
    this.connection.state = External.STATE.ERROR;
    this.connection.host = null;
  }

  connectionError() {
    this.connection.state = External.STATE.ERROR;
  }

  connect(address) {
    this.disconnect();
    this.connection = {
      address : address,
      host : '',
      state : External.STATE.CONNECTING
    }
    getHost(address, this);
  }
}

Operator.registerOperator(External);