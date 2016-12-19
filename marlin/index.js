const _ = require('lodash');
const delay = require('bluebird').delay;

const commands = require('./commands');


class Marlin {
  constructor() {
    this.absoluteMode = true;
    this.settings = {
      maxSpeed: {
        x: 2000,
        y: 2000,
        z: 2000,
        e: 300,
      },
    };

    this.commandBuffer = [];
    this.commandBufferMaxLength = 32;

    // Position refers to the position driven by the provided commands
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      e: 0,
    };

    // Motion position is the actual real-time position
    this.motionPosition = {
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

    this.processMotionBuffer();
  }

  async processMotionBuffer() {
    while (true) {
      while (this.commandBuffer.length > 0) {
        const gcodeObject = this.commandBuffer[0];
        switch (gcodeObject.command) {
          case 'G1': {
            const newPosition = {
              x: this.motionPosition.x,
              y: this.motionPosition.y,
              z: this.motionPosition.z,
              e: this.motionPosition.e,
            };

            gcodeObject.args.forEach((arg) => {
              if (arg.indexOf('X') !== -1) {
                newPosition.x = Number(arg.split('X')[1]);
              }
              if (arg.indexOf('Y') !== -1) {
                newPosition.y = Number(arg.split('Y')[1]);
              }
              if (arg.indexOf('Z') !== -1) {
                newPosition.z = Number(arg.split('Z')[1]);
              }
              if (arg.indexOf('E') !== -1) {
                newPosition.e = Number(arg.split('E')[1]);
              }
            });
            await delay(2000);
            // Need to replace generic two second delay with a properly calculated delay, based on the current feedrate
            break;
          }
          case 'G4': {
            let delayAmount = 0;
            gcodeObject.args.forEach((arg) => {
              if (gcodeObject.indexOf('S') !== -1) {
                delayAmount = parseInt(arg.split('S')[1], 10) * 1000;
              }
              if (arg.indexOf('P') !== -1) {
                delayAmount = parseInt(arg.split('P')[1], 10);
              }
            });
            await delay(delayAmount);
            break;
          }
          case 'M400': {
            break;
          }
          default: {
            break;
          }
        }
        this.commandBuffer.shift();
      }
      await delay(10);
    }
  }

  async sendGcode(gcode) {
    // Wait until there is space in the buffer
    while (this.commandBuffer.length > this.commandBufferMaxLength) {
      await delay(10);
    }

    const gcodeObject = this.parseGcode(gcode);
    this.commandBuffer.push(gcodeObject);
    const gcodeReply = await this.processCommand(gcodeObject);

    return gcodeReply;
  }

  parseGcode(gcode) {
    const commandArray = gcode.split(' ');
    const command = commandArray.shift() || '';
    const commandObject = {
      gcode,
      command,
      args: commandArray,
    };
    return commandObject;
  }

  async processCommand(gcodeObject) {
    let reply = '';
    // Check if the desired command exists
    for (const [key, value] of _.toPairs(commands)) {
      if (gcodeObject.command === key) {
        reply = await value(this, gcodeObject);
      }
    }
    return reply;
  }
}

module.exports = Marlin;
