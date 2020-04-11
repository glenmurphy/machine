import Cell from "/core/cell.mjs";
import Operator from "/core/operator.mjs";
import UI from "./ui.mjs";

var renderers = {};
renderers['_'] = function(operator, ctx, x, y) {
  ctx.save();
  ctx.fillStyle = UI.COLOR_FIELD;
  ctx.fillRect(x + UI.CELL_WIDTH * 0.15, y + UI.CELL_HEIGHT * 0.1, 
               UI.CELL_WIDTH * 0.7, UI.CELL_HEIGHT * 0.8);
  ctx.restore();
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
  ctx.save();
  ctx.strokeStyle = UI.COLOR_WIRE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

renderers['X'] = function(operator, ctx, x, y) {
  if (operator.connection.connected) {
    ctx.save();
    ctx.fillRect(x - 1, y - 1, UI.CELL_WIDTH + 2, UI.CELL_HEIGHT + 2);
    ctx.fillStyle = 'black';
    ctx.fillText('X', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
    ctx.restore();
  } else {
    ctx.fillText('X', x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
}

// Passing in the coords like this is daft; should just be translating on the 
// parent context first
export default function(operator, ctx, x, y) {
  var letter = operator.constructor.letter;
  if (letter in renderers) {
    return renderers[letter](operator, ctx, x, y);
  } else {
    ctx.fillText(letter, x + UI.CELL_WIDTH / 2, y + UI.CELL_HEIGHT / 2);
  }
}