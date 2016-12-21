module.exports = async (marlin, gcodeObject) => {
  // TODO: account for relative or absolute mode

  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('X') !== -1) {
      marlin.position.x.setpoint = Number(arg.split('X')[1], 10);
    }
    if (arg.indexOf('Y') !== -1) {
      marlin.position.y.setpoint = Number(arg.split('Y')[1], 10);
    }
    if (arg.indexOf('Z') !== -1) {
      marlin.position.z.setpoint = Number(arg.split('Z')[1], 10);
    }
    if (arg.indexOf('E') !== -1) {
      marlin.position.e.setpoint = Number(arg.split('E')[1], 10);
    }
  });

  return `${gcodeObject.gcode}: ok`;
};
