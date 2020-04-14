import Operator from '/core/operator.mjs'
import Grid from '/core/grid.mjs'
import Cell from '/core/cell.mjs'
import * as Loader from '/core/loader.mjs';
import {Mov, Bridge} from '/core/operators/index.mjs';
import operatorRenderer from './operator_renderer.mjs';
import Machine from '/core/machine.mjs';
import GetExample from './examples.mjs';

function createElement(type, className, parent) {
  var node = document.createElement(type);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}
export default class UI {
  static COLOR_OPERATOR = 'rgb(0, 255, 150)';
  static COLOR_OPERATOR_GLOW = 'rgba(0, 255, 150, 0.65)';
  static COLOR_OPERATOR_OFF = 'rgb(255, 128, 0)';

  static COLOR_ERROR = 'rgb(255, 0, 0)';
  static COLOR_DATA = 'white';
  static COLOR_INIT = 'rgb(128, 128, 128)';

  static COLOR_GRID = '#161616';
  static GRID_FONT = '16px grid, Consolas, Menlo';

  static CELL_WIDTH = 12;
  static CELL_HEIGHT = 14;

  static posFromCell(cellX, cellY) {
    return {
      x : cellX * UI.CELL_WIDTH,
      y : cellY * UI.CELL_HEIGHT
    }
  }

  static cellFromPos(posX, posY) {
    return {
      x : Math.floor(posX / UI.CELL_WIDTH),
      y : Math.floor(posY / UI.CELL_HEIGHT)
    }
  }

  constructor(machine) {
    this.machine;
    this.load();

    // what grid pixel coordinate the viewport is focused on
    this.viewFocus = {
      x : 200,
      y : 200
    }

    this.node = createElement('div', 'main', document.body);
    this.grid = createElement('div', 'grid', this.node);

    this.backgroundGrid = createElement('canvas', 'operators', this.grid);
    this.operatorGrid = createElement('canvas', 'operators', this.grid);
    this.dataGrid = createElement('canvas', 'data', this.grid);

    // Event/UI handling
    this.mouseDown = false;
    window.addEventListener('resize', this.handleResize.bind(this));
    this.dataGrid.addEventListener('click', this.handleGridClick.bind(this));

    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.focusedCellPos = { x : 0, y : 0};
    this.hoverCellPos = { x : -1000, y : -1000};

    this.initCanvases();
    this.play();
  }

  initCanvases() {
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
    this.operatorCtx.shadowBlur = 15;
    this.operatorCtx.shadowColor = UI.COLOR_OPERATOR_GLOW;

    this.dataGrid.width = window.innerWidth;
    this.dataGrid.height = window.innerHeight;
    this.dataCtx = this.dataGrid.getContext("2d");
    this.dataCtx.fillStyle = UI.COLOR_DATA;
    this.dataCtx.strokeStyle = UI.COLOR_DATA;
    this.dataCtx.font = UI.GRID_FONT;
    this.dataCtx.textBaseline = "middle";
    this.dataCtx.textAlign = "center";
    this.dataCtx.imageSmoothingEnabled = false;
    this.dataCtx.shadowBlur = 8;
    this.dataCtx.shadowColor = "rgba(0, 0, 0, 1)";
  }

  handleResize() {
    this.initCanvases();
    this.display();
  }

  play() {
    this.updateInterval = setInterval(this.step.bind(this), 100);
  }
  
  pause() {
    clearInterval(this.updateInterval);
    this.updateInterval = null;
  }

  playPause() {
    if (this.updateInterval) {
      this.pause();
    } else {
      this.play();
    }
  }

  powerToggle() {
    if (!this.off) {
      this.machine.powerDown();
      this.off = true;
    } else {
      this.machine.powerUp();
      this.off = false;
    }
  }

  step() {
    var time = window.performance.now();
    this.machine.step();
    var stepTime = window.performance.now();;
    this.display();
    var displayTime = window.performance.now();
    //console.log("step:    " + (stepTime - time) + "\ndisplay: " + (displayTime - stepTime));
  }

  display() {
    // As operatorGrid changes far less frequently, we should implement a
    // dirty/schedule system so we don't redraw it as often

    // Clear layers
    this.operatorCtx.clearRect(0, 0, this.operatorGrid.width, this.operatorGrid.height);
    this.dataCtx.clearRect(0, 0, this.dataGrid.width, this.dataGrid.height);

    // Do scrolling translations
    this.operatorCtx.save();
    this.dataCtx.save();

    let translate = {
      x : this.operatorGrid.width / 2 - this.viewFocus.x,
      y : this.operatorGrid.height / 2 - this.viewFocus.y,
    }
    this.backgroundGrid.style.transform = `translate(${translate.x % UI.CELL_WIDTH - UI.CELL_WIDTH}px,` +
                                                    `${translate.y % UI.CELL_HEIGHT - UI.CELL_HEIGHT}px)`;
    this.operatorCtx.translate(translate.x, translate.y);
    this.dataCtx.translate(translate.x, translate.y);

    // Draw hover
    var hPos = UI.posFromCell(this.hoverCellPos.x, this.hoverCellPos.y);
    this.operatorCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.operatorCtx.strokeRect(hPos.x, hPos.y,
                            UI.CELL_WIDTH, UI.CELL_HEIGHT);
    // Draw focus
    var fPos = UI.posFromCell(this.focusedCellPos.x, this.focusedCellPos.y);
    this.operatorCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.operatorCtx.fillRect(fPos.x, fPos.y,
                            UI.CELL_WIDTH, UI.CELL_HEIGHT);

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

    this.operatorCtx.restore();
    this.dataCtx.restore();
  }

  save() {
    window.localStorage.setItem('saved', JSON.stringify(Loader.save(this.machine)));
    console.log("saved");
  }

  load() {
    this.machine = new Machine();
    
    if (window.localStorage.getItem('saved')) {
      console.log("loaded");
      if (Loader.load(this.machine, JSON.parse(window.localStorage.getItem('saved'))))
        return;
    }
    
    console.log("no saved machine, loading example");
    Loader.load(this.machine, JSON.parse(GetExample(1)));
  }

  gridPosFromScreen(x, y) {
    return {
      x : x - this.operatorGrid.width / 2 + this.viewFocus.x,
      y : y -  this.operatorGrid.height / 2 + this.viewFocus.y
    }
  }

  handleMouseMove(e) {
    if (this.mouseDown) {
      this.viewFocus.x += this.mouseDown.lastX - e.offsetX;
      this.viewFocus.y += this.mouseDown.lastY - e.offsetY;
      this.mouseDown.lastX = e.offsetX;
      this.mouseDown.lastY = e.offsetY;
      this.display();
    } else {
      var gridPos = this.gridPosFromScreen(e.offsetX, e.offsetY);
      this.hoverCellPos = UI.cellFromPos(gridPos.x, gridPos.y);
      this.display();
    }
  }

  distance(x, y, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
  }

  handleMouseDown(e) {
    this.mouseDown = {
      initX : e.offsetX,
      initY : e.offsetY,
      lastX : e.offsetX,
      lastY : e.offsetY,
      dragged : false
    };
  }

  handleMouseUp(e) {
    if (this.mouseDown && 
        this.distance(this.mouseDown.lastX, this.mouseDown.lastY,
                      this.mouseDown.initX, this.mouseDown.initY) < UI.CELL_WIDTH / 2) {
      var gridPos = this.gridPosFromScreen(e.offsetX, e.offsetY);
      this.focusedCellPos = UI.cellFromPos(gridPos.x, gridPos.y);
      this.display();
    }
    this.mouseDown = false;
  }

  handleGridClick(e) {

  }

  createMov(orientation, bridge) {
    if (bridge)
      var o = new Bridge(this.machine, this.focusedCellPos.x, this.focusedCellPos.y);
    else 
      var o = new Mov(this.machine, this.focusedCellPos.x, this.focusedCellPos.y);
    o.setOrientation(orientation);
  }

  handleKeyDown(e) {
    var key = e.key;
    if (e.keyCode == 32) {
      //this.playPause();
      this.powerToggle();
    } else if (e.keyCode == 113) { // F2
      this.save();
    } else if (e.keyCode == 115) { // F4
      this.load();
    } else if (key == Number(key)) {
      this.machine.setInit(this.focusedCellPos.x, this.focusedCellPos.y, key);
      this.focusedCellPos.x += 1;
    } else if (key == key.toString().toUpperCase()) {
      // Insert operator
      if (key in Operator.letterMap) {
        new Operator.letterMap[key](this.machine, this.focusedCellPos.x, this.focusedCellPos.y);
        this.focusedCellPos.x += 1;
      } else {
        console.log(key + " not found");
      }
    } else if (e.keyCode == 8 || e.keyCode == 46 || e.key == 'x') {
      // Delete data
      this.machine.deleteCell(this.focusedCellPos.x, this.focusedCellPos.y);
    } else if (e.keyCode == 37) { // left arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.LEFT, e.ctrlKey);
      this.focusedCellPos.x -= e.ctrlKey ? 2 : 1;
    } else if (e.keyCode == 39) { // Right arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.RIGHT, e.ctrlKey);
      this.focusedCellPos.x += e.ctrlKey ? 2 : 1;
    } else if (e.keyCode == 38) { // Up arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.UP, e.ctrlKey);
      this.focusedCellPos.y -= e.ctrlKey ? 2 : 1;
    } else if (e.keyCode == 40) { // Down arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.DOWN, e.ctrlKey);
      this.focusedCellPos.y += e.ctrlKey ? 2 : 1; 
    } else {
      //console.log("undefined input");
    }
    
    this.display();
  }
}