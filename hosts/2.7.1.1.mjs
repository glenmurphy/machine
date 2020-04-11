// Test puzzle
// 
// Once we've figured this out we'll turn it into a base class
import {Host} from '../core/host.mjs';

export default class Puzzle1 extends Host {
  constructor(operator) {
    super(operator);
    this.setConnected();
  }

  input(inputValue) {
    if (!this.problems) {
      switch (inputValue) {
        case '5':
          this.startPuzzle();
          break;
        default:
          alert("Multiply all outputs by two and return them\nInput a 5 to start");
      }
    } else {
      if (inputValue == this.answers[this.problemIndex]) {
        // correct answer
        if (this.problemIndex == this.answers.length - 1) {
          // finished problems
          alert("ALL CORRECT");
          this.problems = null;
          this.answers = null;
          this.problemIndex = null;
        } else {
          this.setData([this.problems[++this.problemIndex]]);
        }
      } else {
        alert("WRONG");
        this.setDisconnected();
      }
    }
  }

  generatePuzzle() {
    this.problems = [];
    this.answers = [];
    for (var i = 0; i < 8; i++) {
      this.problems[i] = parseInt(Math.floor(Math.random() * 8));
      this.answers[i] = this.problems[i] * 2;
    }
  }

  startPuzzle() {
    this.generatePuzzle();
    this.problemIndex = 0;
    this.setData([this.problems[this.problemIndex]]);
  }
}