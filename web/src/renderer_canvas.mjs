import Grid from '/core/grid.mjs'
import UI from './ui.mjs'; // for config values
import Operator from "/core/operator.mjs";
import Cell from "/core/cell.mjs";

// Convenience function
function createElement(type, className, parent) {
  var node = document.createElement(type);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

// Renderers for specific operators
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
  ctx.globalAlpha = 1.0;
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
function operatorRenderer(operator, ctx, x, y) {
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

export default class CanvasRenderer {
  constructor(ui, machine, node) {
    this.ui = ui;
    this.machine = machine;
    this.node = node;
    this.backgroundGrid = createElement('canvas', 'operators', this.node);
    this.operatorGrid = createElement('canvas', 'operators', this.node);
    this.dataGrid = createElement('canvas', 'data', this.node);
  }

  init() {
    this.backgroundGrid.width = window.innerWidth + UI.CELL_WIDTH;
    this.backgroundGrid.height = window.innerHeight + UI.CELL_HEIGHT;
    this.backgroundCtx = this.backgroundGrid.getContext("2d");
    this.backgroundCtx.fillStyle = '#000';
    this.backgroundCtx.fillRect(0, 0, this.backgroundGrid.width, this.backgroundGrid.height);
    this.backgroundCtx.fillStyle = UI.COLOR_GRID;
    for (var x = 0; x < this.backgroundGrid.width; x += UI.CELL_WIDTH) {
      for (var y = 0; y < this.backgroundGrid.height; y += UI.CELL_HEIGHT) {
        this.backgroundCtx.fillRect(x + UI.CELL_WIDTH / 2 - 1, y + UI.CELL_HEIGHT / 2 - 1, 2, 2);
      }
    }

    this.operatorGrid.width = window.innerWidth;
    this.operatorGrid.height = window.innerHeight;
    this.operatorCtx = this.operatorGrid.getContext("2d");
    this.operatorCtx.fillStyle = UI.COLOR_OPERATOR;
    this.operatorCtx.strokeStyle = UI.COLOR_OPERATOR;
    this.operatorCtx.font = UI.GRID_FONT;
    this.operatorCtx.textBaseline = "middle";
    this.operatorCtx.textAlign = "center";
    this.operatorCtx.imageSmoothingEnabled = false;
    //this.operatorCtx.shadowBlur = 15;
    //this.operatorCtx.shadowColor = UI.COLOR_OPERATOR_GLOW;

    this.dataGrid.width = window.innerWidth;
    this.dataGrid.height = window.innerHeight;
    this.dataCtx = this.dataGrid.getContext("2d");
    this.dataCtx.fillStyle = UI.COLOR_DATA;
    this.dataCtx.strokeStyle = UI.COLOR_DATA;
    this.dataCtx.font = UI.GRID_FONT;
    this.dataCtx.textBaseline = "middle";
    this.dataCtx.textAlign = "center";
    this.dataCtx.imageSmoothingEnabled = false;
    //this.dataCtx.shadowBlur = 8;
    //this.dataCtx.shadowColor = "rgba(0, 0, 0, 1)";
  }

  render() {
  // As operatorGrid changes far less frequently, we should implement a
    // dirty/schedule system so we don't redraw it as often

    // Clear layers
    this.operatorCtx.clearRect(0, 0, this.operatorGrid.width, this.operatorGrid.height);
    this.dataCtx.clearRect(0, 0, this.dataGrid.width, this.dataGrid.height);

    // Do scrolling translations
    this.operatorCtx.save();
    this.dataCtx.save();

    let translate = {
      x : this.operatorGrid.width / 2 - this.ui.viewFocus.x,
      y : this.operatorGrid.height / 2 - this.ui.viewFocus.y,
    }

    this.backgroundGrid.style.transform = `translate(${translate.x % UI.CELL_WIDTH - UI.CELL_WIDTH}px,` +
                                                    `${translate.y % UI.CELL_HEIGHT - UI.CELL_HEIGHT}px)`;
    this.operatorCtx.translate(translate.x, translate.y);
    this.dataCtx.translate(translate.x, translate.y);

    // Draw operators
    this.operatorCtx.fillStyle = UI.COLOR_OPERATOR;
    var operatorContent = this.machine.operators.getContent();
    for (var coords in operatorContent) {
      var cPos = Grid.parseCoords(coords);
      var pos = UI.posFromCell(cPos.x, cPos.y);
      operatorRenderer(operatorContent[coords], this.operatorCtx, pos.x, pos.y, UI.CELL_WIDTH, UI.CELL_HEIGHT);
    };

    // Draw init and data
    var initContent = this.machine.init.getContent();
    var dataContent = this.machine.data.getContent();

    this.dataCtx.fillStyle = UI.COLOR_INIT;
    this.dataCtx.strokeStyle = UI.COLOR_INIT;
    for (var coords in initContent) {
      // Don't draw init values if data exists in same space
      if (dataContent[coords])
        continue;
      var cPos = Grid.parseCoords(coords);
      var pos = UI.posFromCell(cPos.x, cPos.y);
      this.dataCtx.fillText(initContent[coords], pos.x + UI.CELL_WIDTH / 2, pos.y + UI.CELL_HEIGHT / 2);
    };

    this.dataCtx.fillStyle = UI.COLOR_DATA;
    this.dataCtx.strokeStyle = UI.COLOR_DATA;
    for (var coords in dataContent) {
      var cPos = Grid.parseCoords(coords);
      var pos = UI.posFromCell(cPos.x, cPos.y);
      this.dataCtx.fillText(dataContent[coords], pos.x + UI.CELL_WIDTH / 2, pos.y + UI.CELL_HEIGHT / 2);
    };

    // Draw hover
    var hPos = UI.posFromCell(this.ui.hoverCellPos.x, this.ui.hoverCellPos.y);
    this.dataCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.dataCtx.strokeRect(hPos.x, hPos.y,
                            UI.CELL_WIDTH, UI.CELL_HEIGHT);
    // Draw focus
    var fPos = UI.posFromCell(this.ui.focusedCellPos.x, this.ui.focusedCellPos.y);
    this.dataCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.dataCtx.fillRect(fPos.x, fPos.y,
                            UI.CELL_WIDTH, UI.CELL_HEIGHT);

    this.operatorCtx.restore();
    this.dataCtx.restore();
  }
}