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
  static STATE = {
    DISCONNECTED : 'Disconnected',
    CONNECTING : 'Connecting',
    CONNECTED : 'Connected',
    ERROR : 'Error'
  }

  constructor(operator) {
    this.operator = operator;
  }

  setConnected() {
    this.operator.connected(this);
  }

  setData(data) {
    this.operator.setData(data);
  }

  operatorDisconnect(operator) {}
}

export default 1;