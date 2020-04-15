import * as test from './test.mjs';
import Cell from '../core/cell.mjs';

test.beginTest("Cell Test");

test.step(
  function testPosition() {
    var a = new Cell(null, 3, 5);
    test.assertEqual(a.pos.x, 3, "Cell x position");
    test.assertEqual(a.pos.y, 5, "Cell y position");

    var b = new Cell(a, 1, 7);
    test.assertEqual(b.pos.x, 4, "Nested cell x position");
    test.assertEqual(b.pos.y, 12, "Nested cell y position");
    
    b.offsetX += 2;
    test.assertEqual(b.pos.x, 6, "Nested cell modified x position");

    a.offsetX += 3;
    test.assertEqual(b.pos.x, 9, "Nested cell modified x position");
  },
  function testOrientationTransforms() {
    
  }
);