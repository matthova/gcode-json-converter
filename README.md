### GCode JSON Converter ![gcode-json-converter build status](https://travis-ci.org/MachineCollaborationUtility/gcode-json-converter.svg?branch=master)

A basic tool for converting GCode into a JSON object and GCode JSON objects back into gcode.

### Contributing
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributions](./CONTRIBUTING.md).


``` js
const gcodeToObject = require('gcode-json-converter').gcodeToObject;
const objectToGcode = require('gcode-json-converter').objectToGcode;

// Convert a line of gcode into an object
const g1Result = gcodeToObject('G1 X -0.1; soooo cool');
const objectResult = {
  command: 'G1',
  args: {
    x: -0.1,
  },
  comment: ' soooo cool',
};

// Convert a gcode object back into a line of gcode
const backToGcode = objectToGcode(g1Result);
const stringResult = 'G1 X-0.1; so cooool'

```

