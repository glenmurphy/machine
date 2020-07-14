import Cell from './cell.mjs'

class Chip extends Cell {
  constructor(parent, machine, offsetX, offsetY, orientation, width, height) {
    super(parent, offsetX, offsetY, orientation);
    this.width = width;
    this.height = height;
  }
}