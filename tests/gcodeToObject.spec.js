/* global describe, it */

const assert = require('chai').assert;
const gcodeToObject = require('../index').gcodeToObject;

describe('Object To GCode functionality', () => {
  it('Should throw an error if the input arg is not an object', () => {
    try {
      gcodeToObject(42);
    } catch (ex) {
      assert.equal(ex.message, 'gcode argument must be of type "string". 42 is type "number"');
    }
  });

  it('Should parse "M114"', () => {
    const result = gcodeToObject('M114');

    const expected = {
      command: 'M114',
      args: {},
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse "G90" with a new line at the end', () => {
    const result = gcodeToObject('G90\n');

    const expected = {
      command: 'G90',
      args: {},
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse "G90" without a new line at the end', () => {
    const result = gcodeToObject('G90');

    const expected = {
      command: 'G90',
      args: {},
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse G28XY, G28 X Y, G28X Y, and G28  XY identically', () => {
    const result1 = gcodeToObject('G28XY');
    const result2 = gcodeToObject('G28 X Y');
    const result3 = gcodeToObject('G28X Y');
    const result4 = gcodeToObject('G28  XY');

    const expected = {
      command: 'G28',
      args: {
        x: true,
        y: true,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result1, expected);
    assert.deepEqual(result2, expected);
    assert.deepEqual(result3, expected);
    assert.deepEqual(result4, expected);
  });

  it('Should parse "M106 S0"', () => {
    const result = gcodeToObject('M106 S0');

    const expected = {
      command: 'M106',
      args: {
        s: 0,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse "M104 S0 T0"', () => {
    const result = gcodeToObject('M104 S0 T0');

    const expected = {
      command: 'M104',
      args: {
        s: 0,
        t: 0,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse "M104 S0"', () => {
    const result = gcodeToObject('M104 S0');

    const expected = {
      command: 'M104',
      args: {
        s: 0,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('Should parse identically all versions of "G1 X1"', () => {
    const g1X1Array = [
      'G1X1',
      'G1 X1',
      'G1X 1',
      'G1 X 1',
      'G1X+1',
      'G1 X+1',
      'G1X +1',
      'G1 X +1',
    ];

    const expected = {
      command: 'G1',
      args: {
        x: 1,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    g1X1Array.forEach((g1Command) => {
      const g1Result = gcodeToObject(g1Command);
      assert.deepEqual(g1Result, expected);
    });
  });

  it('Should parse identically all versions of "G1 X-1"', () => {
    const g1X1Array = [
      'G1X-1',
      'G1 X-1',
      'G1X -1',
      'G1 X -1',
    ];

    const expected = {
      command: 'G1',
      args: {
        x: -1,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    g1X1Array.forEach((g1Command) => {
      const g1Result = gcodeToObject(g1Command);
      assert.deepEqual(g1Result, expected);
    });
  });

  it('Should parse identically all versions of "G1 X-0.1"', () => {
    const g1X1Array = [
      'G1X-0.1',
      'G1 X-0.1',
      'G1X -0.1',
      'G1 X -0.1',
      'G1X-.1',
      'G1 X-.1',
      'G1X -.1',
      'G1 X -.1',
    ];

    const expected = {
      command: 'G1',
      args: {
        x: -0.1,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    g1X1Array.forEach((g1Command) => {
      const g1Result = gcodeToObject(g1Command);
      assert.deepEqual(g1Result, expected);
    });
  });

  it('Should parse identically all versions of "G1 X0.1"', () => {
    const g1X1Array = [
      'G1X0.1',
      'G1 X0.1',
      'G1X 0.1',
      'G1 X 0.1',
      'G1X+0.1',
      'G1 X+0.1',
      'G1X +0.1',
      'G1 X +0.1',
      'G1X.1',
      'G1 X.1',
      'G1X .1',
      'G1 X .1',
      'G1X+.1',
      'G1 X+.1',
      'G1X +.1',
      'G1 X +.1',
    ];

    const expected = {
      command: 'G1',
      args: {
        x: 0.1,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    g1X1Array.forEach((g1Command) => {
      const g1Result = gcodeToObject(g1Command);
      assert.deepEqual(g1Result, expected);
    });
  });

  // Not sure if this makes the most sense, but for now this is how it works
  it('What do we do if we get "T0"?', () => {
    const result = gcodeToObject('T0');

    const expected = {
      command: undefined,
      args: {
        t: 0,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process "G1 X1.23 Y 5.0 z-1"', () => {
    const result = gcodeToObject('G1 X1.23 Y 5.0 z-1');

    const expected = {
      command: 'G1',
      args: {
        x: 1.23,
        y: 5,
        z: -1,
      },
      comment: undefined,
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process comments', () => {
    const result = gcodeToObject('G1 X1.23 Y4.56 Z7.89 ; comment string');

    const expected = {
      command: 'G1',
      args: {
        x: 1.23,
        y: 4.56,
        z: 7.89,
      },
      comment: ' comment string',
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process comments with a semicolon in them', () => {
    const result = gcodeToObject('G1 X1.23 Y4.56 Z7.89 ; comment string; more comment');

    const expected = {
      command: 'G1',
      args: {
        x: 1.23,
        y: 4.56,
        z: 7.89,
      },
      comment: ' comment string; more comment',
      commentTag: {
        command: undefined,
        args: {},
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process a command with a checkpoint commentTag', () => {
    const result = gcodeToObject('; <<<CHECKPOINT>>> bot1 : 19490');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<CHECKPOINT>>> bot1 : 19490',
      commentTag: {
        command: 'checkpoint',
        args: {
          bot1: 19490,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process a command with a precursor commentTag', () => {
    const result = gcodeToObject('  ; <<<PRECURSOR>>> bot2 : 19949');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<PRECURSOR>>> bot2 : 19949',
      commentTag: {
        command: 'precursor',
        args: {
          bot2: 19949,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process a command with a dry commentTag', () => {
    const result = gcodeToObject('; <<<DRY>>> TRUE');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<DRY>>> TRUE',
      commentTag: {
        command: 'dry',
        args: {
          dry: true,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process a command with a layer commentTag', () => {
    const result = gcodeToObject('; <<<LAYER>>> 1666');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<LAYER>>> 1666',
      commentTag: {
        command: 'layer',
        args: {
          layer: 1666,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should be able to process a command with an x entry commentTag', () => {
    const result = gcodeToObject('; <<<X ENTRY>>> 36.6829');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<X ENTRY>>> 36.6829',
      commentTag: {
        command: 'xEntry',
        args: {
          xEntry: 36.6829,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should create a boolean TRUE value, if no params are passed with the comment tag command', () => {
    const result = gcodeToObject('; <<<PAUSE>>>');
    const expected = {
      command: undefined,
      args: {},
      comment: ' <<<PAUSE>>>',
      commentTag: {
        command: 'pause',
        args: {
          pause: true,
        },
      },
    };

    assert.deepEqual(result, expected);
  });

  it('should not care about spaces prior to the comment tag', () => {
    const result = gcodeToObject(';<<<PAUSE>>>');
    const expected = {
      command: undefined,
      args: {},
      comment: '<<<PAUSE>>>',
      commentTag: {
        command: 'pause',
        args: {
          pause: true,
        },
      },
    };

    assert.deepEqual(result, expected);
  });
});
