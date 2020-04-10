import Cell from "../../core/cell.mjs";
import Operator from "../../core/operator.mjs";

var renderers = {};
renderers['_'] = function(operator, ctx, x, y, cellWidth, cellHeight) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 255, 255, 0.25)';
  ctx.fillRect(x + cellWidth * 0.15, y + cellHeight * 0.1, cellWidth * 0.7, cellHeight * 0.8);
  ctx.restore();
}

renderers['M'] = function(operator, ctx, x, y, cellWidth, cellHeight) {
  var orientation = operator.pos.orientation;
  var vert = Boolean(orientation == Cell.ORIENTATION.UP || orientation == Cell.ORIENTATION.DOWN);
  var hori = !vert;
  var from = {
    x : x + cellWidth / 2,
    y : y + cellHeight / 2
  }
  var to = {
    x : vert ? from.x : (orientation == Cell.ORIENTATION.RIGHT ? from.x + cellWidth : from.x - cellWidth),
    y : hori ? from.y : (orientation == Cell.ORIENTATION.DOWN ? from.y + cellHeight : from.y - cellHeight)
  }
  ctx.save();
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

// Passing in the coords like this is daft; should just be translating on the 
// parent context first
export default function(operator, ctx, x, y, cellWidth, cellHeight) {
  var letter = operator.constructor.letter;
  if (letter in renderers) {
    return renderers[letter](operator, ctx, x, y, cellWidth, cellHeight);
  } else {
    ctx.fillText(letter, x + cellWidth / 2 + 1, y + cellHeight / 2 + 1);
  }
}