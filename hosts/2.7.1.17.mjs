// Test puzzle
// 
// Once we've figured this out we'll turn it into a base class
import {Host} from '../core/host.mjs';

export default class Puzzle_2_7_1_17 extends Host {
  static address = '2.7.1.4';

  constructor(operator) {
    super(operator);
    this.setConnected();
  }

  input(inputValue) {
    if (!this.answer) {
      this.startPuzzle();
      console.log("");
    } else {
      if (inputValue == this.answer) {
        // correct answer
        console.log("correct");
        this.answer = null;
        this.setRestarted();
      } else {
        console.log("wrong");
        this.setDisconnected();
      }
    }
  }

  generatePuzzle() {
    this.string = [];
    var length = Math.floor(Math.random() * 10) + 1;
    for (var i = 0; i < length; i++) {
      this.string.push(Math.floor(Math.random()*10));
    }
  }

  startPuzzle() {
    this.generatePuzzle();
    this.setData(this.string);
  }
}