const delay = require('bluebird').delay;

module.exports = async (marlin, gcodeObject) => {
  while (marlin.bufferLength > 0) {
    await delay(10);
  }
  return `${gcodeObject.gcode}: ok`;
};
