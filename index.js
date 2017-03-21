const MCE = require('./lib');
const gcodeToObject = require('./lib/gcodeToObject');
const objectToGcode = require('./lib/objectToGcode');

module.exports = MCE;
module.exports.gcodeToObject = gcodeToObject;
module.exports.objectToGcode = objectToGcode;
