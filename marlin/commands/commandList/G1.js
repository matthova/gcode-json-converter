const G1 = async (marlin, gcodeObject) => {
  // TODO: account for relative or absolute mode
  // TODO: add ability to read new feedrates
  // TODO: add proper feedrate handling when moving multiple axes simultaneously
  gcodeObject.args.forEach((arg) => {
    if (arg.indexOf('X') !== -1) {
      marlin.position.x.latest = Number(arg.split('X')[1], 10);
    }
    if (arg.indexOf('Y') !== -1) {
      marlin.position.y.latest = Number(arg.split('Y')[1], 10);
    }
    if (arg.indexOf('Z') !== -1) {
      marlin.position.z.latest = Number(arg.split('Z')[1], 10);
    }
    if (arg.indexOf('E') !== -1) {
      marlin.position.e.latest = Number(arg.split('E')[1], 10);
    }
  });

  return 'ok';
};

module.exports = G1;
