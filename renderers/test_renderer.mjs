import * as test from './test.mjs';

import Machine from '../machine.mjs';
import Add from '../operators/math/add.mjs';
import Sub from '../operators/math/sub.mjs';
import { renderText } from '../../renderers/text_renderer.mjs';

test.beginTest("Renderer Test");

test.step(
  function testRendererText() {
    var m = new Machine();
    var a = new Add(m, 3, 1);
    m.data.set(2, 1, 1);
    m.data.set(4, 1, 4);

    var b = new Sub(m, 4, 2);
    m.data.set(5, 2, 1);
    
    m.step();
    m.step();
    var text = renderText(m, 0, 0, 8, 4);
    test.assertEqual(text,
                    "........\n" +
                    "..1"+Add.letter+"4...\n" +
                    "...5"+Sub.letter+"1..\n" +
                    "....4...\n",
                    "Text Output");
  }
);