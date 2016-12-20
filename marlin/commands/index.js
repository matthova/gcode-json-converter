const delay = require('bluebird').delay;

const commands = {
  G1: (marlin, gcodeObject) => {
    // Need to account for relative or absolute mode
    const newPosition = {
      x: marlin.position.x,
      y: marlin.position.y,
      z: marlin.position.z,
      e: marlin.position.e,
    };

    gcodeObject.args.forEach((arg) => {
      if (arg.indexOf('X') !== -1) {
        newPosition.x = Number(arg.split('X')[1], 10);
      }
      if (arg.indexOf('Y') !== -1) {
        newPosition.y = Number(arg.split('Y')[1], 10);
      }
      if (arg.indexOf('Z') !== -1) {
        newPosition.z = Number(arg.split('Z')[1], 10);
      }
      if (arg.indexOf('E') !== -1) {
        newPosition.e = Number(arg.split('E')[1], 10);
      }
    });

    marlin.position = newPosition;

    return `${gcodeObject.gcode}: ok`;
  },
  G4: async (marlin, gcodeObject) => {
    while (marlin.bufferLength > 0) {
      await delay(10);
    }
    let delayAmount = 0;
    for (const arg of gcodeObject.args) {
      if (arg.indexOf('S') !== -1) {
        delayAmount = parseInt(arg.split('S')[1], 10) * 1000;
      } else if (arg.indexOf('P') !== -1) {
        delayAmount = parseInt(arg.split('P')[1], 10);
      }
    }
    await delay(delayAmount);
    return `${gcodeObject.gcode}: ok`;
  },
  M400: async (marlin, gcodeObject) => {
    while (marlin.bufferLength > 0) {
      await delay(10);
    }
    return `${gcodeObject.gcode}: ok`;
  },
};

module.exports = commands;
