// Test puzzle
// 
// Once we've figured this out we'll turn it into a base class
import {Host} from '../core/host.mjs';

export default class Puzzle1 extends Host {
  static address = '2.7.1.4';

  constructor(operator) {
    super(operator);
    this.setConnected();
  }

  input(inputValue) {
    if (!this.answer) {
      this.startPuzzle();
      console.log("Count the length of the string; the string will never be more than 12 characters long");
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
    this.answer = Math.floor(Math.random() * 10) + 1;
    for (var i = 0; i < this.answer; i++) {
      this.string.push(Math.floor(Math.random()*10));
    }
  }

  startPuzzle() {
    this.generatePuzzle();
    this.setData(this.string);
  }
}