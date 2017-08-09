const to = require('to-case');
const objectToGcode = require('./objectToGcode');

class GcodeObject {
  constructor() {
    this.command = undefined;
    this.args = {};
    this.comment = undefined;
    this.commentTag = {
      command: undefined,
      args: {},
    };
  }

  toGcode(args) {
    return objectToGcode(this, args);
  }
}

/*
 * Type of command is held within <<< >>>
 * Afterwards args are passed
 * The arguments are either a value, or a key value pair
 * If the args are a single value, then a key value pair is made where the command is the key
 */
function parseCommentTag(comment) {
  const commentTag = {
    command: undefined,
    args: {},
  };

  const commentTagRegex = /.*<<<(.+)\s*>>>\s*(.*)/;
  const result = comment.match(commentTagRegex);

  // Don't parse the result unless you have data
  if (result && result.length >= 2 && result[1]) {
    const metaCommand = to.camel(result[1].toLowerCase());
    commentTag.command = metaCommand;

    if (result[2]) {
      const commentTagArgs = result[2].toLowerCase();
      if (commentTagArgs.includes(':')) {
        const commentTagKeyValue = commentTagArgs.split(':');
        const key = to.camel(commentTagKeyValue[0]);

        // Parse to number, if it's a number
        const value = Number.isNaN(Number(commentTagKeyValue[1])) ?
        commentTagKeyValue[1] : Number(commentTagKeyValue[1]);

        commentTag.args = JSON.parse(`{"${key}": ${value}}`);
      } else {
        commentTag.args = JSON.parse(`{"${metaCommand}": ${commentTagArgs}}`);
      }
    } else {
      commentTag.args = JSON.parse(`{"${metaCommand}": true}`);
    }
  }

  return commentTag;
}

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

  // Constructing a blank gcode object, with functions
  const gcodeObject = new GcodeObject();

  // Split the gcode by the first semicolon it sees
  const commentSplits = gcode.split(';');
  const gcodeWithoutComment = commentSplits[0];
  if (commentSplits.length > 1) {
    const comment = commentSplits.slice(1).join(';');
    gcodeObject.comment = comment;
    gcodeObject.commentTag = parseCommentTag(comment);
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
  axes.forEach((axis) => {
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
