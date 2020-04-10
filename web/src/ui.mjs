import Grid from '/core/grid.mjs';
import Cell from '/core/cell.mjs';
import Operator from '/core/operator.mjs';
import * as Loader from '/core/loader.mjs';
import {Mov} from '/core/operators/index.mjs';
import operatorRenderer from './operator_renderer.mjs';
import Machine from '../../core/machine.mjs';

function createElement(type, className, parent) {
  var node = document.createElement(type);
  if (className) node.className = className;
  if (parent) parent.appendChild(node);
  return node;
}

export default class UI {
  static cellWidth = 14;
  static cellHeight = 14;
  static posFromCell(cellX, cellY) {
    return {
      x : cellX * UI.cellWidth,
      y : cellY * UI.cellHeight
    }
  }
  static cellFromPos(posX, posY) {
    return {
      x : Math.floor(posX / UI.cellWidth),
      y : Math.floor(posY / UI.cellHeight)
    }
  }

  constructor(machine) {
    this.machine;
    this.load();

    this.node = createElement('div', 'main', document.body);
    this.grid = createElement('div', 'grid', this.node);

    // Theme setup
    this.themeOperatorColor = 'cyan';

    // Canvas setup
    this.columns = 40;
    this.rows = 25;

    this.backgroundGrid = createElement('canvas', 'operators', this.grid);
    this.backgroundGrid.width = this.columns * UI.cellWidth;
    this.backgroundGrid.height = this.rows * UI.cellHeight;
    this.backgroundCtx = this.backgroundGrid.getContext("2d");
    this.backgroundCtx.fillStyle = '#000';
    this.backgroundCtx.fillRect(0, 0, this.backgroundGrid.width, this.backgroundGrid.height);
    this.backgroundCtx.fillStyle = '#111';
    for (var x = 0; x < this.columns; x++) {
      for (var y = 0; y < this.rows; y++) {
        var pos = UI.posFromCell(x, y);
        this.backgroundCtx.fillRect(pos.x + UI.cellWidth / 2 - 1, pos.y + UI.cellHeight / 2 - 1, 2, 2);
      }
    }

    this.operatorGrid = createElement('canvas', 'operators', this.grid);
    this.operatorGrid.width = this.columns * UI.cellWidth;
    this.operatorGrid.height = this.rows * UI.cellHeight;
    this.operatorCtx = this.operatorGrid.getContext("2d");
    this.operatorCtx.fillStyle = this.themeOperatorColor;
    this.operatorCtx.strokeStyle = this.themeOperatorColor;
    this.operatorCtx.font = '16px grid';
    this.operatorCtx.textBaseline = "middle";
    this.operatorCtx.textAlign = "center";
    this.operatorCtx.imageSmoothingEnabled = false;
    //this.operatorCtx.shadowBlur = 15;
    //this.operatorCtx.shadowColor = this.themeOperatorColor;

    this.dataGrid = createElement('canvas', 'data', this.grid);
    this.dataGrid.width = this.columns * UI.cellWidth;
    this.dataGrid.height = this.rows * UI.cellHeight;
    this.dataCtx = this.dataGrid.getContext("2d");
    this.dataCtx.fillStyle = 'white';
    this.dataCtx.strokeStyle = 'white';
    this.dataCtx.font = '16px grid';
    this.dataCtx.textBaseline = "middle";
    this.dataCtx.textAlign = "center";
    this.dataCtx.imageSmoothingEnabled = false;
    //this.dataCtx.shadowBlur = 15;
    //this.dataCtx.shadowColor = "rgba(255, 255, 255, 0.4)";

    // Event/UI handling
    this.dataGrid.addEventListener('click', this.handleGridClick.bind(this));
    this.dataGrid.addEventListener('mousemove', this.handleGridMouseMove.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.focusedCellPos = { x : -1, y : -1};
    this.hoverCellPos = { x : -1, y : -1};
  
    this.display();

    this.play();
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

  step() {
    var time = window.performance.now();
    this.machine.step();
    var stepTime = window.performance.now();;
    this.display();
    var displayTime = window.performance.now();
    //console.log("step:    " + (stepTime - time) + "\ndisplay: " + (displayTime - stepTime));
  }

  display() {
    // Operator layer
    this.operatorCtx.clearRect(0, 0, this.operatorGrid.width, this.operatorGrid.height);
    
    // Draw hover
    var hPos = UI.posFromCell(this.hoverCellPos.x, this.hoverCellPos.y);
    this.operatorCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.operatorCtx.strokeRect(hPos.x, hPos.y,
                            UI.cellWidth, UI.cellHeight);
    // Draw focus
    var fPos = UI.posFromCell(this.focusedCellPos.x, this.focusedCellPos.y);
    this.operatorCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.operatorCtx.fillRect(fPos.x, fPos.y,
                            UI.cellWidth, UI.cellHeight);

    // Draw operators
    this.operatorCtx.fillStyle = 'cyan';
    var operatorContent = this.machine.operators.getContent();
    for (var coords in operatorContent) {
      var cPos = Grid.parseCoords(coords);
      var pos = UI.posFromCell(cPos.x, cPos.y);
      operatorRenderer(operatorContent[coords], this.operatorCtx, pos.x, pos.y, UI.cellWidth, UI.cellHeight);
    };

    // Draw data
    this.dataCtx.clearRect(0, 0, this.dataGrid.width, this.dataGrid.height);
    var dataContent = this.machine.data.getContent();
    for (var coords in dataContent) {
      var cPos = Grid.parseCoords(coords);
      var pos = UI.posFromCell(cPos.x, cPos.y);
      this.dataCtx.fillText(dataContent[coords], pos.x + UI.cellWidth / 2, pos.y + UI.cellHeight / 2);
    };
    
  }

  save() {
    window.localStorage.setItem('saved', JSON.stringify(Loader.save(this.machine)));
    console.log("saved");
  }

  load() {
    if (window.localStorage.getItem('saved')) {
      this.machine = new Machine();
      Loader.load(this.machine, JSON.parse(window.localStorage.getItem('saved')));
      console.log("loaded");
    } else {
      console.log("no saved machine");
    }
  }

  handleGridClick(e) {
    this.focusedCellPos = UI.cellFromPos(e.offsetX, e.offsetY);
    this.display();
  }

  handleGridMouseMove(e) {
    this.hoverCellPos = UI.cellFromPos(e.offsetX, e.offsetY);
    this.display();
  }

  createMov(orientation) {
    var o = new Mov(this.machine, this.focusedCellPos.x, this.focusedCellPos.y);
    o.setOrientation(orientation);
  }

  handleKeyDown(e) {
    var key = e.key;
    if (e.keyCode == 32) {
      this.playPause();
    } else if (e.keyCode == 113) { // F2
      this.save();
    } else if (e.keyCode == 115) { // F4
      this.load();
    } else if (key == Number(key)) {
      this.machine.setData(this.focusedCellPos.x, this.focusedCellPos.y, key);
      this.focusedCellPos.x += 1;
    } else if (key == key.toString().toUpperCase()) {
      // Insert operator
      if (key in Operator.letterMap) {
        new Operator.letterMap[key](this.machine, this.focusedCellPos.x, this.focusedCellPos.y);
        this.focusedCellPos.x += 1;
      } else {
        console.log(key + " not found");
      }
    } else if (e.keyCode == 8 || e.keyCode == 46) {
      // Delete data
      this.machine.deleteCell(this.focusedCellPos.x, this.focusedCellPos.y);
    } else if (e.keyCode == 37) { // left arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.LEFT);
      this.focusedCellPos.x -= 1;
    } else if (e.keyCode == 39) { // Right arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.RIGHT);
      this.focusedCellPos.x += 1;
    } else if (e.keyCode == 38) { // Up arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.UP);
      this.focusedCellPos.y -= 1;
    } else if (e.keyCode == 40) { // Down arrow
      if (e.shiftKey)
        this.createMov(Cell.ORIENTATION.DOWN);
      this.focusedCellPos.y += 1; 
    } else {
      //console.log("undefined input");
    }
    
    this.display();
  }
}