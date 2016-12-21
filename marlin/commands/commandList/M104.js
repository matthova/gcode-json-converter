// We're expecting a reply string something like this
// ok T:0.0 /0.0 B:0.0 /0.0
module.exports = async (marlin, gcodeObject) => {
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('S') !== -1) {
      const newTemp = Number(arg.split('s')[1], 10).toFixed(1);
      marlin.temperature.t.setpoint = newTemp;
    }
  });
  return 'ok';
};
