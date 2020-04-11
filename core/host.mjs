export function getHost(address, operator) {
  // TODO: figure out external IPs
  // if the address is a file
  console.log(address);
  import('/hosts/'+address+'.mjs')
    .then((hostModule) => {
      new hostModule.default(operator);
    })
    .catch(err => { 
      console.log(err);
      operator.connectionError();
    });
}

// this is a default class/interface for external (X) operators 
// you need to extend this class
export class Host {
  constructor(operator) {
    this.operator = operator;
  }

  input() {}

  // Methods for subclasses to call - you should think of these
  // as protected methods
  setConnected() {
    this.operator.hostConnected(this);
  }
  setDisconnected() {
    this.operator.hostDisconnected(this);
  }
  setData(data) {
    this.operator.setData(data);
  }
  appendData(data) {
    this.operator.appendData(data);
  }

  // External interfaces
  operatorDisconnect(operator) {}
}

export default 1;