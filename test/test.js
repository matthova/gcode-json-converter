/* global it, describe */
const assert = require('assert');
const delay = require('bluebird').delay;

const Marlin = require('../');

describe('Testing Marlin emulator functionality', () => {
  const marley = new Marlin();

  it('Has an initial position of X=0, Y=0, Z=0, E=0', async function() {
    const position = marley.position;
    const expectedPositon = {
      x: 0,
      y: 0,
      z: 0,
      e: 0,
    };

    assert.deepEqual(position, expectedPositon);
  });

  it('Can wait one second', async function() {
    await delay(1000);
    assert.equal(true, true);
  });

  it('Has a position of X=10, Y=0, Z=0, E=0 after sent GCode "G1 X10"', async function() {
    await marley.sendGcode('G1 X10');
    const position = marley.position;
    const expectedPositon = {
      x: 10,
      y: 0,
      z: 0,
      e: 0,
    };

    assert.deepEqual(position, expectedPositon);
  });
});
