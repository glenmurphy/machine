class Cell {
  // To figure out stacked orientations, just add these together and % 4 them
  static ORIENTATION = {
    UP : 0,
    LEFT : 1,
    DOWN : 2,
    RIGHT : 3
  }
  static RotateOffset(x, y, orientation) {
    // e.g. x=1, y=-10 (towards top of screen)
    if (orientation == Cell.ORIENTATION.UP) {
      return { x : x, y : y }   // x=1, y=-10
    } else if (orientation == Cell.ORIENTATION.RIGHT) {
      return { x : -y, y : x }  // x=10, y=1
    } else if (orientation == Cell.ORIENTATION.DOWN) {
      return { x : -x, y : -y } // x=-1, y=-10
    } else if (orientation == Cell.ORIENTATION.LEFT) {
      return { x : y, y : -x }  // x=-10, y=-1
    }
  }

  constructor(parentCell, offsetX, offsetY) {
    this.parentCell = parentCell;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.localOrientation = Cell.ORIENTATION.UP;
  }

  setOrientation(orientation) {
    orientation = orientation % 4;
    if (Number.isNaN(orientation))
      throw new Error("Invalid orientation: " + orientation);
    this.localOrientation = orientation;
  }

  get parent() {
    return this.parentCell;
  }

  // relative to root, so we need to stack up orientation transformations as we go
  get pos() {
    if (!this.parentCell) {
      return {
        x : this.offsetX,
        y : this.offsetY,
        orientation : this.localOrientation
      };
    }

    var parentPos = this.parentCell.pos;
    var rotatedOffset = Cell.RotateOffset(this.offsetX, this.offsetY, parentPos.orientation);
    return {
      x : parentPos.x + rotatedOffset.x,
      y : parentPos.y + rotatedOffset.y,
      orientation : (parentPos.orientation + this.localOrientation) % 4
    }
  }
}

export default Cell;