// We're expecting a reply string something like this
// ok T:0.0 /0.0 B:0.0 /0.0
module.exports = async (marlin, gcodeObject) => {
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('S') !== -1) {
      const newTemp = parseFloat(Number(arg.split('S')[1]).toFixed(1));
      marlin.temperature.t.setpoint = newTemp;
    }
  });
  return 'ok';
};
