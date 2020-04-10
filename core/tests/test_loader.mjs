import * as test from './test.mjs';

import Machine from '../machine.mjs';
import * as Loader from '../loader.mjs';
import Add from '../operators/math/add.mjs';
import Sub from '../operators/math/sub.mjs';

test.beginTest("Loader Test");

test.step(
  function testSave() {
    var m = new Machine();
    var a = new Add(m, 4, 5);
    m.setData(1, 5, 1);

    var output = Loader.save(m);

    // Don't have predictable array ordering
    test.assertEqual(output.operators[0].type, 'ADD', "Operator export ID");
    test.assertEqual(output.operators[0].x, 4, "Operator export X");
    test.assertEqual(output.operators[0].y, 5, "Operator export Y");
    
    test.assertEqual(output.grid[0].value, 1, "Data export VALUE");
    test.assertEqual(output.grid[0].x, 1, "Data export X");
    test.assertEqual(output.grid[0].y, 5, "Data export Y");
  },
  function testLoad() {
    var m = new Machine();
    var data = {
      version: 1,
      operators: [ 
        { type: 'ADD', x: 4, y: 5 },
        { type: 'SUB', x: 3, y: 5 }
      ],
      grid: [ { value: 1, x: '2', y: '5' } ]
    }
    Loader.load(m, data);
    test.assertEqual(m.operators.get(4, 5).constructor.type, 'ADD', "ADD operator loaded");
    test.assertEqual(m.operators.get(3, 5).constructor.type, 'SUB', "SUB operator loaded");
    test.assertEqual(m.getData(2, 5), 1, "Data loaded");
  },
  function testSaveLoad() {
    var m = new Machine();
    var a = new Add(m, 4, 5);
    var b = new Sub(m, 3, 5);
    m.setData(2, 5, 3);
    m.setData(4, 5, 1);

    var n = new Machine();
    var saved = Loader.save(m);
    Loader.load(n, saved);
    
    test.assertEqual(n.operators.get(4, 5).constructor.type, 'ADD', "ADD operator saved+loaded");
    test.assertEqual(n.operators.get(3, 5).constructor.type, 'SUB', "SUB operator saved+loaded");
    test.assertEqual(n.getData(2, 5), 3, "Data saved+loaded");

    test.assertEqual(n.getData(3, 6), null, "Data saved+loaded - SUB pre-step");
    n.step();
    test.assertEqual(n.getData(3, 6), 2, "Data saved+loaded - SUB post-step");
  },
);