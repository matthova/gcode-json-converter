const commands = {
  G1: (marlin, gcodeObject) => {
    // Need to account for relative or absolute mode
    const newPosition = {
      x: marlin.position.x,
      y: marlin.position.y,
      z: marlin.position.z,
      e: marlin.position.e,
    };

    gcodeObject.args.forEach((arg) => {
      if (arg.indexOf('X') !== -1) {
        newPosition.x = parseInt(arg.split('X')[1], 10);
      }
      if (arg.indexOf('Y') !== -1) {
        newPosition.y = parseInt(arg.split('Y')[1], 10);
      }
      if (arg.indexOf('Z') !== -1) {
        newPosition.z = parseInt(arg.split('Z')[1], 10);
      }
      if (arg.indexOf('E') !== -1) {
        newPosition.e = parseInt(arg.split('E')[1], 10);
      }
    });

    marlin.position = newPosition;

    return 'ok';
  },
};

module.exports = commands;
