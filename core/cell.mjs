export default class Cell {
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

  constructor(parentCell, offsetX, offsetY, orientation) {
    this.parentCell = parentCell;
    if (this.parentCell && this.parentCell.addChild) {
      this.parentCell.addChild(this);
    }
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.setOrientation(orientation ? orientation : Cell.ORIENTATION.UP);
    this.children = [];
  }

  delete() {
    if (this.parentCell && this.parentCell.removeChild) {
      this.parentCell.removeChild(this);
    }
  }

  addChild(cell) {
    this.children.push(cell);
  }

  removeChild(cell) {
    for (var i = 0; i < this.children.length; i++) {
      if (cell == this.children[i]) {
        this.children.splice(i, 1);
        return;
      }
    }
  }

  setOrientation(orientation) {
    orientation = orientation % 4;
    if (Number.isNaN(orientation))
      throw new Error("Invalid orientation: " + orientation);
    this.localOrientation = orientation;

    this.invalidatePos();
  }

  invalidatePos() {
    this.posCache = null;
    
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].invalidatePos();
    }
  }

  cachePos() {
    if (!this.parentCell) {
      this.posCache = {
        x : this.offsetX,
        y : this.offsetY,
        orientation : this.localOrientation
      };
      return;
    }

    var parentPos = this.parentCell.pos;
    var rotatedOffset = Cell.RotateOffset(this.offsetX, this.offsetY, parentPos.orientation);
    this.posCache = {
      x : parentPos.x + rotatedOffset.x,
      y : parentPos.y + rotatedOffset.y,
      orientation : (parentPos.orientation + this.localOrientation) % 4
    }
  }

  get parent() {
    return this.parentCell;
  }

  // relative to root, so we need to stack up orientation transformations as we go
  get pos() {
    if (!this.posCache)
      this.cachePos();
    return this.posCache;
  }
}