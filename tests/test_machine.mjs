import * as test from './test.mjs';

import Machine from '../core/machine.mjs';
import Add from '../core/operators/math/add.mjs';

test.beginTest("Machine Test");
test.step(
  function testStep() {
    var m = new Machine();
    var a = new Add(m, 3, 5);
    m.data.set(2, 5, 1);
    m.data.set(4, 5, 3);

    m.step();
    test.assertEqual(m.data.get(2, 5), 1, "Input A stable after step");
    test.assertEqual(m.data.get(4, 5), 3, "Input B stable after step");
    test.assertEqual(m.data.get(3, 6), 4, "Output C after step");

    m.step();
  },
  function testMultipleSteps() {
    var m = new Machine();
    var a = new Add(m, 3, 5);
    m.data.set(2, 5, 1);
    m.data.set(4, 5, 3);

    var b = new Add(m, 4, 6); // on right of output of previous function
    m.data.set(5, 6, 5);

    m.step();
    test.assertEqual(m.data.get(4, 7), null, "Output null after 1 step");

    m.step();
    test.assertEqual(m.data.get(4, 7), 9, "Output created after 2 steps");
  }
);
/*
test.step(
  function testInconsistentLineLength() {
    var m = new Machine();
    test.expectError(
      function() {m.load(".....\n..a..\n....\n")}, 
      "Inconsistent line length");
  },
  function testElementNotFound() {
    var m = new Machine();
    test.expectError(
      function() {m.load("b^v<>.\n.◂▼▲▸\n..b..\n")},
      "'b' not defined", "Element not found");
  },
  function testOutput() {
    var m = new Machine();
    var l = "...a\n.a..\n....\naaaa\n";
    m.load(l);
    test.assertEqual(m.output(), l, "Output");
  },
  function testOutput() {
    var m = new Machine();
    var l = "...a\n.a..\n....\naaaa\n";
    m.load(l);
    test.assertEqual(m.output(), l, "Step + Output");
  },
  function testStep() {
    var m = new Machine();
    m.load("1a2.\n....\n....\n....\n");
    m.step();
    test.assertEqual(m.output(), "1a2.\n.3..\n....\n....\n", "Step + Output");
  }
);
*/