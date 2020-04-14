import Grid from './grid.mjs';
import Operator from './operator.mjs';

function loadVersion001(machine, input) {
  machine.powerDown();
  input.operators.forEach(function(def) {
    if (!(def.type in Operator.typeMap)) {
      throw new Error("Operator '" + def.type + "' not defined");
    }
    // we should just have the opposite of 'import()';
    var o = new Operator.typeMap[def.type](machine, def.x, def.y);
    o.import(def);
  });
  input.init.forEach(function (def) {
    machine.setInit(def.x, def.y, def.value);
  });
  
  machine.powerUp();
  return true;
}

export function load(machine, input) {
  try {
    switch(input.version) {
      case 1:
        return loadVersion001(machine, input);
        break;
      default:
        console.log("Version not defined");
    }
  } catch(e) {
    console.log(`Error: ${e.message}`);
    return false;
  }
}

export function save(machine) {
  var output = {};
  output.version = 1;
  output.operators = [];
  output.init = [];

  var operatorContent = machine.operators.getContent();
  for (var coords in operatorContent) {
    output.operators.push(operatorContent[coords].export());
  };

  var initContent = machine.init.getContent();
  for (var coords in initContent) {
    if (typeof initContent[coords] == 'undefined' || initContent[coords] == null) continue;

    var pos = Grid.parseCoords(coords);

    output.init.push({
      value : initContent[coords],
      x : pos.x,
      y : pos.y
    });
  }

  return output;
}