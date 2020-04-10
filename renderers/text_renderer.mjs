import Grid from '../grid.mjs';
var nullChar = '.';

function getChar(obj) {
  if (!obj)
    return nullChar;
  return obj.toString().charAt(0);
}
 
export function renderText(machine, originX, originY, width, height) {
  var output = [];
  for (var ix = 0; ix < width; ix++) {
    output[ix] = [];
    for (var iy = 0; iy < height; iy++) {
      output[ix][iy] = nullChar;
    }
  }

  function getOutputPos(pos) {
    return {
      x : pos.x - originX,
      y : pos.y - originY
    }
  }

  var operatorContent = machine.operators.getContent();
  for (var coords in operatorContent) {
    var oPos = getOutputPos(Grid.parseCoords(coords));
    output[oPos.x][oPos.y] = operatorContent[coords].constructor.letter;
  };

  var dataContent = machine.data.getContent();
  for (var coords in dataContent) {
    var oPos = getOutputPos(Grid.parseCoords(coords));
    output[oPos.x][oPos.y] = dataContent[coords];
  };

  var outputText = ''
  
  for (var iy = 0; iy < height; iy++) {
    for (var ix = 0; ix < width; ix++) {
      outputText += getChar(output[ix][iy]);
    }
    outputText += "\n";
  }
  return outputText;
}