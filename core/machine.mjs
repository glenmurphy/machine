/*
 * Machine ALFA
 *
 * Inspired by Factorio, ORCA, and TIS-100
 * Much of this architecture is set up to enable experimentation over efficiency; once we have
 * more of an idea about what we're doing, maybe we can look at doing this in C!
 */
import Grid from './grid.mjs';
import Cell from './cell.mjs';

class Machine {
  constructor() {
    this.operators = new Grid();
    this.data = new Grid();
    this.stepCount = 0;
  }

  addOperator(operator) {
    // Validate, check for overlaps
    if (this.operators.get(operator.pos.x, operator.pos.y)) {
      console.log("Warning: An operator was already occupying that position");
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
    this.data.set(x, y, value);
  }

  deleteCell(x, y) {
    this.operators.set(x, y, null);
    this.data.set(x, y, null);
  }

  step() {
    // Check to see if input is valid
    for (let coords in this.operators.getContent()) {
      this.operators.getContent()[coords].validate();
    };

    // Tell operators to process input
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

export default Machine;