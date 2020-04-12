import Cell from './cell.mjs'

class IOCell extends Cell {
  constructor(parent, machine, offsetX, offsetY) {
    super(parent, offsetX, offsetY);
    this.machine = machine;
    this.queued = false;
    this.nextValue = null;
  }

  get value() {
    return this.machine.getData(this.pos.x, this.pos.y);
  }

  setNextValue(value) {
    this.queued = true;
    this.nextValue = value;
  }

  commitNextValue() {
    if (!this.queued)
      return;
    this.forceDataValue(this.nextValue);
    this.nextValue = null;
    this.queued = false;
  }

  forceDataValue(value) {
    this.machine.setData(this.pos.x, this.pos.y, value);
  }
}

export default class Operator extends Cell {
  static type;       // Unique type for the operator
  static letter;     // Single-character letter to represent the operator
  static description;

  static typeMap = {};
  static letterMap = {};
  static registerOperator(operator) {
    if (operator.type in Operator.typeMap)
      console.log("WARNING: Operator '" + operator.type + "' already registered");
    Operator.typeMap[operator.type] = operator;

    if (operator.letter in Operator.letterMap)
      console.log("WARNING: Operator '" + operator.latter + "' already registered");
    Operator.letterMap[operator.letter] = operator;
  }

  static STATE = {
    // The operator is ready to process input
    WAITING : 'Waiting',

    // The operator has checked for valid inputs
    READY : 'Ready',

    // The operator has processed input and its output queues are full
    PROCESSED : 'Processed',
  }

  constructor(machine, offsetX, offsetY) {
    super(machine, offsetX, offsetY);
    this.machine = machine;
    this.inputs = {};
    this.outputs = {};
    this.state = Operator.STATE.WAITING;
    this.data = [];

    this.init();

    this.machine.addOperator(this);
  }

  init() {
    throw new Error("init() not overridden");
  }

  addInput(inputName, offsetX, offsetY) {
    if (inputName in this.inputs) {
      throw new Error("Input '"+inputName+"' already exists");
    }
    for (let id in this.inputs) {
      if (this.inputs[id].offsetX == offsetX && this.inputs[id].offsetY == offsetY)
        throw new Error("Added input '"+id+"' is at same location as existing input '"+inputName+"'");
    }
    this.inputs[inputName] = new IOCell(this, this.machine, offsetX, offsetY);
  }

  addOutput(outputName, offsetX, offsetY) {
    if (outputName in this.outputs) {
      throw new Error("Output '"+outputName+"' already exists");
    }
    for (let id in this.outputs) {
      if (this.outputs[id].offsetX == offsetX &&
          this.outputs[id].offsetY == offsetY)
        throw new Error("Added output  '"+outputName+"' is at same location as existing output '" + id + "'");
    }
    this.outputs[outputName] = new IOCell(this, this.machine, offsetX, offsetY);
  }

  validateData(data) {
    if (!Array.isArray(data))
      throw new Error("Data is not an array"); 
    return true;
  }
  setData(data) {
    if (this.validateData(data))
      this.data = data;
  }
  appendData(data) {
    if (this.validateData(data))
      this.data = this.data.concat(data);
  }

  setInput(name, value) {
    if (!(name in this.inputs))
      throw new Error("Input '"+name+"' does not exist");
    this.inputs[name].forceDataValue(value);
  }

  getInput(name) {
    if (!(name in this.inputs))
      throw new Error("Input '"+name+"' does not exist");
    return this.inputs[name].value;
  }

  queueClearInput(name) {
    if (!(name in this.inputs))
      throw new Error("Input '"+name+"' does not exist");
    this.inputs[name].setNextValue(null);
  }

  commitClearInput(name) {
    if (!(name in this.inputs))
      throw new Error("Input '"+name+"' does not exist");
    this.inputs[name].commitNextValue();
  }

  queueOutput(name, value) {
    if (!(name in this.outputs))
      throw new Error("Output '"+name+"' does not exist");
    this.outputs[name].setNextValue(value);
  }

  commitOutput(name) {
    if (!(name in this.outputs))
      throw new Error("Output '"+name+"' does not exist");
    this.outputs[name].commitNextValue();
  }

  // Checks to see if inputs are all present; override if you don't need them all present to work
  validateInputs() {
    for (let id in this.inputs) {
      if (this.inputs[id].value === undefined) {
        return false;
      }
    }
    return true;
  }

  // Check that inputs are valid
  validate() {
    if (this.validateInputs())
      this.state = Operator.STATE.READY;
    else
      this.state = Operator.STATE.WAITING;
  }

  // Execute our main processing
  execute() {
    if (this.state != Operator.STATE.READY)
      return;
    this.process();
    this.state = Operator.PROCESSED
  }

  process() {
    throw new Error("process() not overridden");
  }

  commitClearInputs() {
    for (let id in this.inputs) {
      this.commitClearInput(id);
    }
    this.state = Operator.STATE.WAITING;
  }

  commitOutputs() {
    for (let id in this.outputs) {
      this.commitOutput(id);
    }
    this.state = Operator.STATE.WAITING;
  }

  import(data) {
    this.offsetX = data.x;
    this.offsetY = data.y;
    this.localOrientation = data.orientation | Cell.ORIENTATION.UP;
    this.data = data.data;
  }

  export() {
    var output = {
      type : this.constructor.type,
      x : this.offsetX,
      y : this.offsetY,
      orientation : this.localOrientation
    }
    if (this.data)
      output.data = this.data;
    return output;
  }
}