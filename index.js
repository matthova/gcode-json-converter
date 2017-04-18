const gcodeToObject = require('./lib/gcodeToObject');
const objectToGcode = require('./lib/objectToGcode');

gcodeToObject.gcodeToObject = gcodeToObject;
gcodeToObject.objectToGcode = objectToGcode;

module.exports = gcodeToObject;
