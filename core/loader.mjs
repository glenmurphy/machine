import Grid from './grid.mjs';
import Operator from './operator.mjs';

function loadVersion001(machine, input) {
  input.operators.forEach(function(def) {
    if (!(def.type in Operator.typeMap)) {
      throw new Error("Operator '" + def.type + "' not defined");
    }
    var o = new Operator.typeMap[def.type](machine, def.x, def.y);
    o.setOrientation(def.orientation);
  });
  input.grid.forEach(function (def) {
    machine.setData(def.x, def.y, def.value);
  });
}

export function load(machine, input) {
  switch(input.version) {
    case 1:
      loadVersion001(machine, input);
      break;
    default:
      console.log("Version not defined");
  }
}

export function save(machine) {
  var output = {};
  output.version = 1;
  output.operators = [];
  output.grid = [];

  var operatorContent = machine.operators.getContent();
  for (var coords in operatorContent) {
    output.operators.push(operatorContent[coords].export());
  };

  var dataContent = machine.data.getContent();
  for (var coords in dataContent) {
    if (!dataContent[coords]) continue;

    var pos = Grid.parseCoords(coords);

    output.grid.push({
      value : dataContent[coords],
      x : pos.x,
      y : pos.y
    });     
  }

  return output;
}