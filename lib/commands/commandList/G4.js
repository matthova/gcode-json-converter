const delay = require('bluebird').delay;

const G4 = async (bot, gcodeObject) => {
  while (bot.bufferLength > 0) {
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
  return 'ok';
};

module.exports = G4;
