const _ = require('lodash');
const commands = require('./commands').commands;

class Marlin {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      e: 0,
    };

    this.feedrate = {
      x: 2000,
      y: 2000,
      z: 2000,
      e: 100,
    };
  }

  async sendGcode(gcode) {
    const gcodeObject = this.parseGcode(gcode);
    const gcodeReply = await this.processCommand(gcodeObject);
    return gcodeReply;
  }

  parseGcode(gcode) {
    const commandArray = gcode.split(' ');
    const command = commandArray.shift() || '';
    const commandObject = {
      command,
      args: commandArray,
    };
    return commandObject;
  }

  async processCommand(gcodeObject) {
    let reply = '';
    // Check if the desired command exists
    // PUT IN SOME SORT OF SWITCH HERE
    for (const [key, value] of _.toPairs(commands)) {
      if (gcodeObject.command === key) {
        reply = value(this, gcodeObject);
      }
    }
    return reply;
  }
}

module.exports = Marlin;
