// We're expecting a reply string something like this
// ok T:0.0 /0.0 B:0.0 /0.0
module.exports = async (marlin) => {
  const tActual = marlin.temperature.t.actual.toFixed(1);
  const tSetpoint = marlin.temperature.t.setpoint.toFixed(1);
  const bActual = marlin.temperature.b.actual.toFixed(1);
  const bSetpoint = marlin.temperature.b.actual.toFixed(1);
  return `ok T:${tActual} /${tSetpoint} B:${bActual} /${bSetpoint}`;
};
