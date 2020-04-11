import Operator from '../../operator.mjs';
import {getHost} from '../../host.mjs';

export default class External extends Operator {
  static type = 'EXT';
  static letter = 'X';
  static description = 'External interface'
  
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

    this.connection = {
      address : '',
      connected : false,
      host : null,
    };
  }

  validateInputs() { 
    var a = this.getInput('a');
    var b = this.getInput('b');
    var c = this.getInput('c');
    var d = this.getInput('d');
    return (a && b && c && d);
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

    if (!this.connection.connected)
      return;

    if (this.getInput('i')) {
      this.connection.host.input(this.getInput('i'));
      this.queueClearInput('i');
    }
  }

  disconnect() {
    if (this.connection.connected) {
      this.connection.host.operatorDisconnect(this);
    }

    this.connection = {
      address : '',
      host : '',
      connected : false
    }
    this.data = [];
  }

  connected(host) {
    // Do something with the module.
    this.connection.host = host;
    this.connection.connected = true;
    this.queueOutput('l', 1);
  }

  connectionError() {}

  connect(address) {
    this.disconnect();
    this.connection = {
      address : address,
      host : '',
      connected : false
    }
    getHost(address, this);
  }
}

Operator.registerOperator(External);