const M109 = async (marlin, gcodeObject) => {
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('S') !== -1) {
      const newTemp = parseFloat(Number(arg.split('S')[1]).toFixed(1));
      marlin.temperature.b.setpoint = newTemp;
      marlin.mode.blocking = true;

      // Periodically check if the temerature is reached
      // As soon as the temp is reached, clear the block
      const checkM190 = setInterval(() => {
        if (marlin.temperature.b.setpoint === marlin.temperature.b.actual) {
          marlin.mode.blocking = false;
          clearInterval(checkM190);
        }
      }, 100);
    }
  });
  return 'ok';
};

module.exports = M109;
