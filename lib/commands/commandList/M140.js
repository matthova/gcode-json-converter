const M140 = async (bot, gcodeObject) => {
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('S') !== -1) {
      const newTemp = parseFloat(Number(arg.split('S')[1]).toFixed(1));
      bot.temperature.b.setpoint = newTemp;
    }
  });
  return 'ok';
};

module.exports = M140;
