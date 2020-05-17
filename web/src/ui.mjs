import Operator from '/core/operator.mjs'
import Cell from '/core/cell.mjs'
import * as Loader from '/core/loader.mjs';
import {Mov, Bridge} from '/core/operators/index.mjs';
import Machine from '/core/machine.mjs';
import GetExample from './examples.mjs';
import CanvasRenderer from './renderer_canvas.mjs';

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
  static GRID_FONT = '14px grid, Consolas, Menlo';

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
    this.machine = machine;
    this.load();

    // what grid pixel coordinate the viewport is focused on
    this.viewFocus = {
      x : 200,
      y : 200
    }

    this.node = createElement('div', 'main', document.body);
    this.grid = createElement('div', 'grid', this.node);

    this.renderer = new CanvasRenderer(this, this.machine, this.grid);

    // Event/UI handling
    this.mouseDown = false;
    window.addEventListener('resize', this.handleResize.bind(this));
    this.grid.addEventListener('click', this.handleGridClick.bind(this));

    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.focusedCellPos = { x : 0, y : 0};
    this.hoverCellPos = { x : -1000, y : -1000};

    this.renderer.init();
    this.play();
  }

  handleResize() {
    this.renderer.init();
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
    this.renderer.render();
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
      x : x - window.innerWidth / 2 + this.viewFocus.x,
      y : y -  window.innerHeight / 2 + this.viewFocus.y
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
    if (e.keyCode == 32) { // Space
      this.powerToggle();
    } else if (e.keyCode == 219) { // [
      this.playPause();
    } else if (e.keyCode == 221) { // ]
      this.step();
    } else if (e.keyCode == 113) { // F2
      this.save();
    } else if (e.keyCode == 115) { // F4
      this.load();
    } else if (e.keyCode == 13) { // Return
      this.machine.setInit(this.focusedCellPos.x, this.focusedCellPos.y, prompt("Enter value"));
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