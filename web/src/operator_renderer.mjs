import Cell from "/core/cell.mjs";
import Operator from "/core/operator.mjs";
import UI from "./ui.mjs";

var renderers = {};
renderers['_'] = function(operator, ctx, x, y) {
  ctx.globalAlpha = 0.5;
  ctx.fillRect(x + UI.CELL_WIDTH * 0.15, y + UI.CELL_HEIGHT * 0.1, 
               UI.CELL_WIDTH * 0.7, UI.CELL_HEIGHT * 0.8);
}

renderers['.'] = function(operator, ctx, x, y) {
  var orientation = operator.pos.orientation;
  var vert = Boolean(orientation == Cell.ORIENTATION.UP || orientation == Cell.ORIENTATION.DOWN);
  var hori = !vert;
  var from = {
    x : x + UI.CELL_WIDTH / 2,
    y : y + UI.CELL_HEIGHT / 2
  }
  var to = {
    x : vert ? from.x : (orientation == Cell.ORIENTATION.RIGHT ? from.x + UI.CELL_WIDTH : from.x - UI.CELL_WIDTH),
    y : hori ? from.y : (orientation == Cell.ORIENTATION.DOWN ? from.y + UI.CELL_HEIGHT : from.y - UI.CELL_HEIGHT)
  }
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}
// bridge
renderers[','] = function(operator, ctx, x, y) {
  var orientation = operator.pos.orientation;
  var vert = Boolean(orientation == Cell.ORIENTATION.UP || orientation == Cell.ORIENTATION.DOWN);
  var hori = !vert;
  var from = {
    x : x + UI.CELL_WIDTH / 2,
    y : y + UI.CELL_HEIGHT / 2
  }
  var to = {
    x : vert ? from.x : (orientation == Cell.ORIENTATION.RIGHT ? from.x + UI.CELL_WIDTH * 2 : from.x - UI.CELL_WIDTH * 2),
    y : hori ? from.y : (orientation == Cell.ORIENTATION.DOWN ? from.y + UI.CELL_HEIGHT * 2 : from.y - UI.CELL_HEIGHT * 2)
  }
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(from.x, from.y, UI.CELL_WIDTH * 0.1, 0, 2 * Math.PI);
  ctx.fill();

  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.fill();
}
renderers['#'] = function(operator, ctx, x, y) {
  ctx.globalAlpha = 0.1;
  ctx.fillRect(x, y, UI.CELL_WIDTH, UI.CELL_HEIGHT);
  if (operator.data[0]) {
    ctx.globalAlpha = 1.0;
    ctx.fillText(operator.data[0], x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
}
renderers['B'] = function(operator, ctx, x, y) {
  if (operator.full) {
    ctx.fillStyle = UI.COLOR_ERROR;
    ctx.fillRect(x - 1, y - 1, UI.CELL_WIDTH + 2, UI.CELL_HEIGHT + 2);
    ctx.fillStyle = 'black';
    ctx.fillText('B', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  } else {
    ctx.fillText('B', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
}
renderers['X'] = function(operator, ctx, x, y) {
  if (operator.connection.address) {
    switch (operator.connection.state) {
      case 'Connecting':
        ctx.globalAlpha = 0.5;
        break;
      case 'Connected':
        ctx.globalAlpha = 1;
        break;
      case 'Error':
        ctx.fillStyle = UI.COLOR_ERROR;
        break;
      case 'Disconnected':
        throw new Error('wat');
        break;
    }
    ctx.fillRect(x - 1, y - 1, UI.CELL_WIDTH + 2, UI.CELL_HEIGHT + 2);
    ctx.fillStyle = 'black';
    ctx.fillText('X', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  } else {
    ctx.fillText('X', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
}

// Passing in the coords like this is daft; should just be translating on the 
// parent context first
export default function(operator, ctx, x, y) {
  var letter = operator.constructor.letter;
  var color = (operator.state == Operator.STATE.OFF) ? UI.COLOR_OPERATOR_OFF : UI.COLOR_OPERATOR;
  
  
  ctx.save();
  ctx.shadowBlur = (operator.state == Operator.STATE.OFF) ? 0 : 12;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  
  if (letter in renderers) {
    renderers[letter](operator, ctx, x, y);
  } else {
    ctx.fillText(letter, x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
  ctx.restore();
}