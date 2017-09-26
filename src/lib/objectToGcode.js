const _ = require('lodash');

/*
 * Parses a JSON object and returns a line of GCode
 * Expects a JSON object with each key value pair representing an axis and its corresponding value
 * Returns a Gcode string, without a line break
 */
function objectToGcode(gcodeObject, args = {}) {
  args.comment = args.comment == undefined ? true : args.comment;
  args.precision = args.precision == undefined ? 16 : args.precision;

  // Looking for 16 significant digits, aka only removing floating point madness
  const epsilon = args.precision;

  // Validate input to be of type "object"
  if (typeof gcodeObject !== 'object') {
    throw new Error(
      `Input argument must be of type "object". ${gcodeObject} is type "${typeof gcodeObject}"`
    );
  }

  // Create the gcode string.
  // Start with the command
  // Followed by each axis
  let gcode = '';
  if (gcodeObject.command) {
    gcode += gcodeObject.command;
  }

  // Process extrusion and then feedrate at the end of the commands, if at all
  let processE = false;
  let processF = false;

  _.entries(gcodeObject.args).forEach(([key, value]) => {
    if (key === 'e') {
      processE = true;
    } else if (key === 'f') {
      processF = true;
    } else {
      if (gcode.length > 0) {
        gcode += ' ';
      }
      gcode += key.toUpperCase();
      if (typeof value !== 'boolean') {
        // TODO, allow user to pass prefered precision for any axis or all axes
        const roundedNumber = Number(value.toFixed(epsilon));
        gcode += roundedNumber;
      }
    }
  });

  if (processE) {
    if (gcode.length > 0) {
      gcode += ' ';
    }
    const roundedNumber = Number(gcodeObject.args.e.toFixed(epsilon));
    gcode += `E${roundedNumber}`;
  }

  if (processF) {
    if (gcode.length > 0) {
      gcode += ' ';
    }
    const roundedNumber = Number(gcodeObject.args.f.toFixed(epsilon));
    gcode += `F${roundedNumber}`;
  }

  if (gcodeObject.comment && args.comment !== false) {
    gcode += ';';
    gcode += gcodeObject.comment;
  }

  return gcode;
}

module.exports = objectToGcode;
