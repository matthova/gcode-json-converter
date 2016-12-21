const _ = require('lodash');
const delay = require('bluebird').delay;
const assert = require('chai').assert;

const commands = require('./commands');

class Marlin {
  constructor() {
    this.absoluteMode = true;

    this.commandBuffer = [];
    this.commandBufferMaxLength = 32;

    this.temperature = {
      t: {
        setpoint: 0,
        actual: 0,
      },
      b: {
        setpoint: 0,
        actual: 0,
      },
    };

    // Position refers to the position driven by the provided commands
    this.position = {
      x: {
        setpoint: 0,
        actual: 0,
        buffer: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      y: {
        setpoint: 0,
        actual: 0,
        buffer: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      z: {
        setpoint: 0,
        actual: 0,
        buffer: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      e: {
        setpoint: 0,
        actual: 0,
        buffer: 0,
        feedrate: 100,
        maxFeedrate: 200,
      },
    };

    setInterval(this.simulateMotionBuffer.bind(this), 100);
    setInterval(this.simulateTemperature.bind(this), 1000);
  }

  // Move an object towards the desired setpoint by an increment
  // but don't overshoot the target value
  increment(object, incrementAmount) {
    if (object.setpoint !== object.actual) {
      if (object.setpoint < object.actual) {
        if (object.actual - object.setpoint < incrementAmount) {
          object.actual = object.setpoint;
        } else {
          object.actual -= incrementAmount;
        }
      } else {
        if (object.setpoint - object.actual < incrementAmount) {
          object.actual = object.setpoint;
        } else {
          object.actual += incrementAmount;
        }
      }
    }
  }

  async simulateTemperature() {
    const incrementAmount = 10;
    for (const [key, value] of _.toPairs(this.temperature)) {
      this.increment(value, incrementAmount);
    }
  }

  simulateMotionBuffer() {
    if (this.commandBuffer.length > 0) {
      for (const [key, value] of _.toPairs(this.position)) {
        // Turning the feedrate (mm/min) into (mm/s)
        // then (mm/s) * 1s / 10 one hundreths of a second
        // Since we are updating the position once every 100 milliseconds, this will be our increment value
        const incrementAmount = (value.feedrate * 60) / 10;
        this.increment(value, incrementAmount);
      }

      // check the first command
      // once the command is completed, then remove it from the buffer
      this.processBufferCommand(this.commandBuffer[0]);
    }
  }

  processBufferCommand(gcodeObject) {
    switch (gcodeObject.command) {
      case 'G1': {
        const positionBuffer = {
          x: this.position.x.buffer,
          y: this.position.y.buffer,
          z: this.position.z.buffer,
          e: this.position.e.buffer,
        };
        gcodeObject.args.forEach((arg) => {
          if (arg.indexOf('X') !== -1) {
            this.position.x.buffer = Number(arg.split('X')[1], 10);
          }
          if (arg.indexOf('Y') !== -1) {
            this.position.y.buffer = Number(arg.split('Y')[1], 10);
          }
          if (arg.indexOf('Z') !== -1) {
            this.position.z.buffer = Number(arg.split('Z')[1], 10);
          }
          if (arg.indexOf('E') !== -1) {
            this.position.e.buffer = Number(arg.split('E')[1], 10);
          }
        });
        // if current position == destination then ditch the command
        // else set the new position
        const positionActual = {
          x: this.position.x.actual,
          y: this.position.y.actual,
          z: this.position.z.actual,
          e: this.position.e.actual,
        };
        try {
          if (assert.deepEqual(positionActual, positionBuffer)) {
            this.commandBuffer.shift();
          }
        } catch (ex) { }
        break;
      }
      default: {
        this.commandBuffer.shift();
        break;
      }
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

// process.on('uncaughtException', (err) => {
//   console.error('Uncaught error', err);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled rejection', { reason, promise });
// });

module.exports = Marlin;
