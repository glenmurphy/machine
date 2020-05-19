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
    test.assertEqual(b.pos.x, 4, "Nested cell modified x position - cache old");
    b.invalidatePos();
    test.assertEqual(b.pos.x, 6, "Nested cell modified x position - cache updated");

    a.offsetX += 3;
    test.assertEqual(b.pos.x, 6, "Nested cell modified x position - cache old");
    a.invalidatePos();
    test.assertEqual(b.pos.x, 9, "Nested cell modified x position - cache updated");

  },
  function testOrientationTransforms() {
    var a = new Cell(null, 6, 5);
    var b = new Cell(a, 3, 7);
    a.setOrientation(Cell.ORIENTATION.RIGHT);
    test.assertEqual(b.pos.x, -1, "Rotated parent cell");
    test.assertEqual(b.pos.y, 8, "Rotated parent cell");
  }
);

test.end();