const M109 = async (marlin, gcodeObject) => {
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('S') !== -1) {
      const newTemp = parseFloat(Number(arg.split('S')[1]).toFixed(1));
      marlin.temperature.t.setpoint = newTemp;
      marlin.mode.blocking = true;

      // Periodically check if the temerature is reached
      // As soon as the temp is reached, clear the block
      const checkM109 = setInterval(() => {
        if (marlin.temperature.t.setpoint === marlin.temperature.t.actual) {
          marlin.mode.blocking = false;
          clearInterval(checkM109);
        }
      }, 100);
    }
  });
  return 'ok';
};

module.exports = M109;
