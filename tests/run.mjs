  // Run all 'test_*.js' files in current folder
  import * as tests from './test.mjs';
  import fs from 'fs';
   
  tests.start("All Tests");
  
  var items = fs.readdirSync(".");
  var num_tests = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].indexOf("test_") == 0) {
      num_tests++;
      import("./" + items[i]);
    }
  }
  
  tests.summary();