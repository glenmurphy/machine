/*
 * Machine ALFA
 *
 * Inspired by Factorio, ORCA, and TIS-100
 * Much of this architecture is set up to enable experimentation over efficiency; once we have
 * more of an idea about what we're doing, maybe we can look at doing this in C!
 */
import Grid from './grid.mjs';
import Cell from './cell.mjs';

export default class Machine {
  constructor() {
    this.operators = new Grid();  // our operators (instructions)
    this.init = new Grid();       // initial data  (variables)
    this.data = new Grid();       // live data     (volative memory)
    this.stepCount = 0;

    // Eventually replace this with a grid
    this.powered = true;      
  }

  addOperator(operator) {
    // Validate, check for overlaps
    if (this.operators.get(operator.pos.x, operator.pos.y)) {
      console.log("Warning: An operator was already occupying that position");
    }

    // TODO: figure out if region is powered
    if (!this.isPowered(operator.pos.x, operator.pos.y)) {
      operator.powerDown();
    } else {
      operator.powerUp();
    }

    this.operators.set(operator.pos.x, operator.pos.y, operator);
  }

  get pos() {
    return { x : 0, y : 0, orientation : Cell.ORIENTATION.UP }
  }

  getData(x, y) {
    return this.data.get(x, y);
  }

  setData(x, y, value) {
    if (value === null) {
      this.data.set(x, y, null);
      return true;
    }

    if (isNaN(value))
      return false;
    
    this.data.set(x, y, parseInt(value) % 100);
  }

  setInit(x, y, value) {
    value = parseInt(value) % 100;
    this.init.set(x, y, value);
    this.setData(x, y, value);
  }

  deleteCell(x, y) {
    this.operators.set(x, y, null);
    this.data.set(x, y, null);
    this.init.set(x, y, null);
  }

  isPowered(x, y) {
    return this.powered;
  }

  // TODO: apply to a rect
  powerUp() {
    if (this.powered)
      return;

    console.log("On");
    this.powered = true;
    this.data = new Grid();

    // Copy initializers to data
    for (let coords in this.init.getContent()) {
      var pos = Grid.parseCoords(coords);
      this.setData(pos.x, pos.y, this.init.getContent()[coords]);
    }

    // Power on our operators
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].powerUp();
    };
  }

  // TODO: apply to a rect
  powerDown() {
    if (!this.powered)
      return;
    console.log("Off");
    this.powered = false;
    this.data = new Grid();
    
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].powerDown();
    };
  }

  step() {
    // Check to see if input is valid
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].validate();
    };

    // Tell valid operators to process input
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].execute();
    };

    // Commit any input clearing (for flow control) and then commit outputs; we clear
    // the inputs first because we don't want cleared inputs overriding outputs; if there
    // are output clears that collide with overwrites, we're OK with that for now, but we
    // might change our minds in future and just prioritize all clears then all writes
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].commitClearInputs();
    };

    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].commitOutputs();
    };

    this.stepCount++;
  };
}