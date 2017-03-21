/*
 * Parses a line of GCode and returns an object
 * Expects a single line of gcode
 * Returns an object with a command and a list of arguments
 */
function gcodeToObject(gcode) {
  // Valdate input to be of type "string"
  if (typeof gcode !== 'string') {
    throw new Error(`gcode argument must be of type "string". ${gcode} is type "${typeof gcode}"`);
  }

  const gcodeObject = {
    command: undefined,
    args: {},
    comment: undefined,
  };

  // Split the gcode by the first semicolon it sees
  const commentSplits = gcode.split(';');
  const gcodeWithoutComment = commentSplits[0];
  if (commentSplits.length > 1) {
    gcodeObject.comment = commentSplits.slice(1).join(';');
  }

  // If we can find a command, assign it, otherwise keep the "command" value set to undefined
  const commandRegex = /[GM]\d+/;
  const commandResult = gcodeWithoutComment.toUpperCase().match(commandRegex);
  gcodeObject.command = (commandResult !== undefined || commandResult !== null) &&
  Array.isArray(commandResult) && commandResult.length > 0 ?
  commandResult[0] : undefined;


  // Set the gcode to lower case and remove any G<number> or M<number> commands
  const gcodeArgString = gcodeWithoutComment.toLowerCase().replace(/[gm]\d+/, '');

  // Parse each axis for a trailing floating number
  // If no float, treat the axis as a boolean flag
  const axes = 'abcdefghijklmnopqrstuvwxyz'.split('');
  axes.forEach(axis => {
    // In most cases we are looking for an axis followed by a number
    const axisAndFloatRegex = new RegExp(`${axis}\\s*([+-]?([0-9]*[.])?[0-9]+)`);
    const result = gcodeArgString.match(axisAndFloatRegex);
    if (result) {
      gcodeObject.args[axis] = Number(result[1]);
    // If there is an axis, but no trailing number, pass the axis as a boolean flag
    } else if (gcodeArgString.includes(axis)) {
      gcodeObject.args[axis] = true;
    }
  });

  return gcodeObject;
}

module.exports = gcodeToObject;
