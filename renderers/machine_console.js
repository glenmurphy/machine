var readline = require('readline');

var Machine = require('../machine.js');
var Renderer = require('../renderer.js');

require("../operators/math/add.js");
require("../operators/math/sub.js");


m.load(
  "......\n" +
  "..a...\n" +
  "......\n" +
  "......\n"
);

function animate() {
  //readline.cursorTo(process.stdout, 0, 0)
  //readline.clearScreenDown(process.stdout);
  m.step();

  process.stdout.write('\u001B[?25l'); // hide cursor
  process.stdout.write('\u001B[2J\u001B[0;0f'); // clear screen

  console.log(m.output());
  console.log(m.stepCount);

  process.stdout.write('\u001B[?25h'); // show cursor
}

animate();
setInterval(animate, 1000);