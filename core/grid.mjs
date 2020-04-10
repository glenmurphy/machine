/**
 * The mapping technique here is rubbish; but we'll figure that out after the API
 */
export default class Grid {
  static coords(x, y) {
    return [x, y].join(",");
  }
  static parseCoords(text) {
    var split = text.split(",");
    return {
      x : split[0],
      y : split[1]
    }
  }

  constructor() {
    this.content = {};
  }
  
  get(x, y) {
    return this.content[Grid.coords(x, y)]; 
  }

  set(x, y, value) {
    if (value === null || value === undefined)
      delete this.content[Grid.coords(x, y)];
    else
      this.content[Grid.coords(x, y)] = value;
  }

  getContent() {
    return this.content;
  }

  setContent(content) {
    this.content = content;
  }
}