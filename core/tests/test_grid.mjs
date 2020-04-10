import * as test from './test.mjs';
import Grid from '../grid.mjs';

test.beginTest("Grid Test");

test.step(
  function testGrid() {
    var g = new Grid();
    g.set(1, 3, "hello");
    test.assertEqual(g.get(1, 3), "hello", "Getter")
    test.assertEqual(g.get(1, 4), null, "Getter")
  }
);