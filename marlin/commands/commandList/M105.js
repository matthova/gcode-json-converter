// We're expecting a reply string something like this
// ok T:0.0 /0.0 B:0.0 /0.0
module.exports = async (marlin) => {
  const t = marlin.temperature.t.actual.toFixed(1);
  const b = marlin.temperature.b.actual.toFixed(1);
  return `ok T:${t} /${t} B:${b} /${b}`;
};
