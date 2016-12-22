const _ = require('lodash');
const delay = require('bluebird').delay;
const equal = require('deep-equal');

const commands = require('./commands');

class Marlin {
  constructor() {
    this.mode = {
      absolute: true,
      blocking: false,
    };

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
        latest: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      y: {
        setpoint: 0,
        actual: 0,
        latest: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      z: {
        setpoint: 0,
        actual: 0,
        latest: 0,
        feedrate: 2000,
        maxFeedrate: 3000,
      },
      e: {
        setpoint: 0,
        actual: 0,
        latest: 0,
        feedrate: 100,
        maxFeedrate: 200,
      },
    };

    setInterval(this.simulateMotionBuffer.bind(this), 100);
    setInterval(this.simulateTemperature.bind(this), 100);
  }

  async sendGcode(gcode) {
    // Wait until there is space in the buffer
    while (this.commandBuffer.length > this.commandBufferMaxLength || this.mode.blocking) {
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
    const command = commands[gcodeObject.command];
    if (command !== undefined) {
      reply = await command(this, gcodeObject);
    }
    return reply;
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
        const incrementAmount = (value.feedrate / 60) / 10;
        this.increment(value, incrementAmount);
      }

      // check the first command
      // once the command is completed, then remove it from the buffer
      this.processBufferCommand(this.commandBuffer[0]);
    }
  }

  updatePositionSetpoints(gcodeObject) {
    const axisArray = ['X', 'Y', 'Z', 'E'];

    for (const arg of gcodeObject.args) {
      for (const axis of axisArray) {
        if (arg.indexOf(axis) !== -1) {
          const axisPosition = Number(arg.split(';')[0].split(axis)[1].split(' ')[0], 10);
          this.position[axis.toLowerCase()].setpoint = axisPosition;
        }
      }
    }
  }

  processBufferCommand(gcodeObject) {
    switch (gcodeObject.command) {
      case 'G1': {
        this.updatePositionSetpoints(gcodeObject);
        const positionSetpoint = {
          x: this.position.x.setpoint,
          y: this.position.y.setpoint,
          z: this.position.z.setpoint,
          e: this.position.e.setpoint,
        };
        // if current position == destination then ditch the command
        // else set the new position
        const positionActual = {
          x: this.position.x.actual,
          y: this.position.y.actual,
          z: this.position.z.actual,
          e: this.position.e.actual,
        };

        if (equal(positionActual, positionSetpoint)) {
          this.commandBuffer.shift();
        }
        break;
      }
      default: {
        this.commandBuffer.shift();
        break;
      }
    }
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught error', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection', { reason, promise });
});

module.exports = Marlin;
