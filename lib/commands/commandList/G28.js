const delay = require('bluebird').delay;

const G28 = async (bot, gcodeObject) => {
  let axisArray = [];
  const availableAxes = ['X', 'Y', 'Z'];

  for (const axis of availableAxes) {
    if (gcodeObject.gcode.includes(axis)) {
      axisArray.push(axis);
    }
  }

  while (bot.commandBuffer.length > 0) {
    await delay(10);
  }

  // If no args are passed, make sure that we home every axis
  if (axisArray.length === 0) {
    axisArray = availableAxes;
  }

  for (const axis of axisArray) {
    const axisObject = bot.position[axis.toLowerCase()];
    axisObject.setpoint = 0;
    axisObject.actual = 0;
    axisObject.latest = 0;
  }
  return 'ok';
};

module.exports = G28;
