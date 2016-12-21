// We're expecting a reply string something like this
// ok X:0.00 Y:0.00 Z:0.00 E:0.00 Count X:0.00 Y:0.00 Z:0.00 E0.00';
const M114 = async (marlin) => {
  const currentPosition =
    `X:${marlin.position.x.latest.toFixed(2)} ` +
    `Y:${marlin.position.y.latest.toFixed(2)} ` +
    `Z:${marlin.position.z.latest.toFixed(2)} ` +
    `E:${marlin.position.e.latest.toFixed(2)} `;

  const movingPosition = 'Count ' +
    `X:${marlin.position.x.actual.toFixed(2)} ` +
    `Y:${marlin.position.y.actual.toFixed(2)} ` +
    `Z:${marlin.position.z.actual.toFixed(2)} ` +
    `E:${marlin.position.e.actual.toFixed(2)}`;

  return `ok ${currentPosition}${movingPosition}`;
};

module.exports = M114;
