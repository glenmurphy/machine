// Tester.
var name_;
var errors_ = 0;
var passed_ = 0;
var completed_ = 0;

export function start(name) {
  name_ = name;
  log("");
  log("======================================================================");
  log("\u001b[1;33mSTARTING\u001b[m: " + name + "\n");
}

export function log(text) {
  console.log(text);
}

function logFailed(msg) {
  errors_++;
  log("\u001b[31mFAILED\u001b[m: " + msg);
}

function logPassed(msg) {
  passed_++;
  log("\u001b[32mPASSED\u001b[m: " + msg);
}

export function beginTest(title) {
  log("----------------------------------------------------------------------");
  log("\u001b[1;33mBEGIN\u001b[m : " + title);
}

export function end() {
  completed_++;
}

export function testsCompleted() {
  return completed_;
}

export function assertTrue(a, description) {
  if (!a) {
    logFailed(description + " not true");
  } else {
    logPassed(description);
  }
}

export function assertFalse(a, description) {
  if (a) {
    logFailed(description + " was true");
  } else {
    logPassed(description);
  }
}

export function expectError(a, errorMessage, description) {
  if (!description)
    description = errorMessage;

  try {
    a();
  } catch(err) {
    if (err.message == errorMessage) {
      logPassed(description);
    } else {
      logFailed(description + ":\n" +
        "         expected: '" + errorMessage + "'\n" +
        "         received: '" + err.message + "'");
    }
    return;
  }

  logFailed(description + " not failed");
}

function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}

function areArraysEqual(array1, array2) {
   var temp = new Array();
   if ( (!array1[0]) || (!array2[0]) ) { // If either is not an array
      return false;
   }
   if (array1.length != array2.length) {
      return false;
   }
   // Put all the elements from array1 into a "tagged" array
   for (var i=0; i<array1.length; i++) {
      key = (typeof array1[i]) + "~" + array1[i];
   // Use "typeof" so a number 1 isn't equal to a string "1".
      if (temp[key]) { temp[key]++; } else { temp[key] = 1; }
   // temp[key] = # of occurrences of the value (so an element could appear multiple times)
   }
   // Go through array2 - if same tag missing in "tagged" array, not equal
   for (var i=0; i<array2.length; i++) {
      key = (typeof array2[i]) + "~" + array2[i];
      if (temp[key]) {
         if (temp[key] == 0) { return false; } else { temp[key]--; }
      // Subtract to keep track of # of appearances in array2
      } else { // Key didn't appear in array1, arrays are not equal.
         return false;
      }
   }
   // If we get to this point, then every generated key in array1 showed up the exact same
   // number of times in array2, so the arrays are equal.
   return true;
}

export function assertModelsEqual(a, b, description) {
  var failed = false;

  if (typeof a != typeof b) {
    failed = true;
    logFailed(description + " basic types don't match");
    return;
  }

  if (a.type != b.type) {
    failed = true;
    logFailed(description + " types don't match");
  }

  for (var key in a._properties) {
    if (isArray(a[key])) {
      if (!areArraysEqual(a[key], b[key])) {
        failed = true;
        logFailed(description + " array: '" + key + "' mismatch - '" + a[key] + "' != '" + b[key] + "'");
      }
    } else if (a[key] != b[key]) {
      failed = true;
      logFailed(description + " key: '" + key + "' mismatch - '" + a[key] + "' != '" + b[key] + "'");
    }
  }

  if (!failed)
    logPassed(description);
};

export function assertEqual(a, b, description) {
  if (a != b) {
    logFailed(description + " (" + a + ' != ' + b + ")");
    return;
  }
  logPassed(description);
}

export function assertObjectsEqual(a, b, description) {
  var id_count_a = 0;
  var id_count_b = 0;
  var failed = false;

  for (var id in a) {
    if (a[id] != b[id]) {
      if (typeof a[id] == 'object') {
        assertObjectsEqual(a[id], b[id], description + " a." + id + " > ");
      } else if (typeof a[id] != 'function') {
        logFailed(description + ": a." + id + "("+a[id]+") != b." + id + "("+b[id]+")");
        failed = true;
      }
    } else {
      logPassed(description + ": a." + id + " = b." + id);
    }
    id_count_a++;
  }
  for (var id in b) {
    id_count_b++;
  }
  if (id_count_a != id_count_b) {
    logFailed(description + " id counts different");
    failed = true;
  }

  if (!failed)
    logPassed(description);
}

export function assertClose(margin, a, b, description) {
  if (a < b - margin || a > b + margin) {
    logFailed(description + " (" + a + ' !~= ' + b + ")");
    return;
  }
  logPassed(description);
}

export function step() {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i]();
  }
}

export function summary() {
  log("\n======================================================================");
  if (errors_ > 0) {
    log("\u001b[31mTESTS COMPLETE: " + passed_ + " passed, " + errors_ + " errors\u001b[m\n");
  } else {
    log("\u001b[32mTESTS COMPLETE: " + passed_ + " passed, 0 errors\u001b[m\n");
  }
}