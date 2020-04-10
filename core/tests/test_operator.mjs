import * as test from './test.mjs';

import Machine from '../machine.mjs';
import Add from '../operators/math/add.mjs';
import Operator from '../operator.mjs';

test.beginTest("Operator Test");

test.step(
  function testOperator() {
    var m = new Machine();
    var a = new Add(m, 3, 5);
    m.data.set(2, 5, 1);

    test.assertFalse(a.validateInputs(), "validateInputs(): Input invalid before");
    m.data.set(4, 5, 3);
    test.assertTrue(a.validateInputs(), "validateInputs(): Input valid after");

    test.assertEqual(a.state, Operator.STATE.WAITING, "validate(): State before validation");
    a.validate();
    test.assertEqual(a.state, Operator.STATE.READY, "validate() State after validation");

    test.assertEqual(a.outputs['c'].nextValue, null, "execute(): nextValue not set before execution");
    a.execute();
    test.assertEqual(a.outputs['c'].nextValue, 4, "execute(): nextValue set after execution");

    test.assertEqual(m.data.get(3, 6), null, "commit(): Data not set before commit");
    a.commit();
    test.assertEqual(m.data.get(3, 6), 4, "commit(): Data set after commit");
  },
  function testRegistration() {
    test.assertTrue(Operator.typeMap[Add.type] == Add, "Operator registration for Add ('"+Add.type+"')");
  }
);