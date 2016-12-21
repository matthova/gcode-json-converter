const delay = require('bluebird').delay;

const M400 = async (marlin, gcodeObject) => {
  while (marlin.commandBuffer.length > 0) {
    await delay(10);
  }
  return 'ok';
};

module.exports = M400;
