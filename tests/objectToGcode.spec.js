/* global describe, it */

const assert = require('chai').assert;
const gcodeToObject = require('../dist/index').gcodeToObject;
const objectToGcode = require('../dist/index').objectToGcode;

describe('GCode Parser', () => {
  it('Should throw an error when you ask to parse something other than a string', () => {
    try {
      objectToGcode(42);
    } catch (ex) {
      assert.equal(ex.message, 'Input argument must be of type "object". 42 is type "number"');
    }
  });

  it('Should parse a "M114" command object', () => {
    const gcodeObject = gcodeToObject('M114');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'M114');
  });

  it('Should parse a "G90" command object', () => {
    const gcodeObject = gcodeToObject('G90');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G90');
  });

  it('Should parse a "G28 X Y" command object', () => {
    const gcodeObject = gcodeToObject('G28 X Y');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G28 X Y');
  });

  it('Should parse a "M106 S0" command object', () => {
    const gcodeObject = gcodeToObject('M106 S0');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'M106 S0');
  });

  it('Should parse a "M104 S0 T0" command object', () => {
    const gcodeObject = gcodeToObject('M104 S0 T0');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'M104 S0 T0');
  });

  it('Should parse a "M104 S0" command object', () => {
    const gcodeObject = gcodeToObject('M104 S0');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'M104 S0');
  });

  it('Should parse a "G1 X10 Y10 Z10 E100 F100" command object', () => {
    const gcodeObject = gcodeToObject('G1 X10 Y10 Z10 E100 F100');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X10 Y10 Z10 E100 F100');
  });

  it('Should parse a "G1 X1" command object', () => {
    const gcodeObject = gcodeToObject('G1 X1');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X1');
  });

  it('Should parse a "G1 X-1" command object', () => {
    const gcodeObject = gcodeToObject('G1 X-1');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X-1');
  });

  it('Should parse a "G1 X-0.1" command object', () => {
    const gcodeObject = gcodeToObject('G1 X-0.1');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X-0.1');
  });

  it('Should parse a "G1 X0.1" command object', () => {
    const gcodeObject = gcodeToObject('G1 X0.1');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X0.1');
  });

  // Not sure if this makes the most sense, but for now this is how it works
  it('Should parse a "T0" command object', () => {
    const gcodeObject = gcodeToObject('T0');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'T0');
  });

  it('should be able to process a "G1 X1.23 Y5 Z-1" command object', () => {
    const gcodeObject = gcodeToObject('G1 X1.23 Y5 Z-1');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X1.23 Y5 Z-1');
  });

  it('should be able to process extrude commands', () => {
    const gcodeObject = gcodeToObject('G1 X1.23 E5');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X1.23 E5');
  });

  it('should be able to process comments', () => {
    const gcodeObject = gcodeToObject('G1 X1.23 Y4.56 Z7.89; comment string');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X1.23 Y4.56 Z7.89; comment string');
  });

  it('should remove comments if the arg "comment" is set to false', () => {
    const gcodeObject = gcodeToObject('G1 X1.23 Y4.56 Z7.89; comment string');
    const gcode = gcodeObject.toGcode({ comment: false });
    assert.equal(gcode, 'G1 X1.23 Y4.56 Z7.89');
  });

  it('should be able to process comments with a semicolon in them', () => {
    const gcodeObject = gcodeToObject('G1 X1.23 Y4.56 Z7.89; comment string; more comment');
    const gcode = gcodeObject.toGcode();
    assert.equal(gcode, 'G1 X1.23 Y4.56 Z7.89; comment string; more comment');
  });

  it('should round to the specified precision', () => {
    const gcodeObject = gcodeToObject(`G1 X${Math.PI}`);
    const gcode = gcodeObject.toGcode({ precision: 5 });
    assert.equal(gcode, 'G1 X3.14159');
  });
});
