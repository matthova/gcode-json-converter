/* global it, describe */
const assert = require('chai').assert;

const Marlin = require('../');

describe('Testing Marlin emulator functionality', () => {
  const marley = new Marlin();

  it('Has an initial position of X=0, Y=0, Z=0, E=0', async () => {
    const position = marley.position;
    const expectedPositon = {
      x: 0,
      y: 0,
      z: 0,
      e: 0,
    };

    assert.deepEqual(position, expectedPositon);
  });

  it('Has a position of X=10, Y=0, Z=0, E=0 after sent GCode "G1 X10"', async () => {
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

  it('should wait for commands to finish executing before adding new ones to its buffer', async () => {
    const startTime = new Date().getTime();
    for (let i = 0; i < 33; i++) {
      await marley.sendGcode('G1 X10');
    }
    const endTime = new Date().getTime();
    const passedTime = endTime - startTime;
    console.log('passedTime', passedTime);
    assert.isAtLeast(passedTime, 3400);
  });
});
