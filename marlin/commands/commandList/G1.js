module.exports = async (marlin, gcodeObject) => {
  // Need to account for relative or absolute mode
  const newPosition = {
    x: marlin.position.x,
    y: marlin.position.y,
    z: marlin.position.z,
    e: marlin.position.e,
  };

  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('X') !== -1) {
      newPosition.x = Number(arg.split('X')[1], 10);
    }
    if (arg.indexOf('Y') !== -1) {
      newPosition.y = Number(arg.split('Y')[1], 10);
    }
    if (arg.indexOf('Z') !== -1) {
      newPosition.z = Number(arg.split('Z')[1], 10);
    }
    if (arg.indexOf('E') !== -1) {
      newPosition.e = Number(arg.split('E')[1], 10);
    }
  });

  marlin.position = newPosition;

  return `${gcodeObject.gcode}: ok`;
};
