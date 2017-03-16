### Motion Controller Emulator ![motion controller emulator build status](https://travis-ci.org/Autodesk/motion-controller-emulator.svg?branch=master)

The purpose of this module is to allow for proper testing of code that utilizes gcode-based motion control hardware. We're specifically focused on emulating Marlin firmware, however this software's purpose can be expanded more generally as well.  


### Contributing
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributions](./CONTRIBUTING.md).


``` js
const MCE = require('motion-controller-emulator');

async function example() {
  // Create a new MCE instance
  const bot = new MCE();

  // Open the connection
  await bot.open()
  
  const positionReply = await bot.sendGcode('M114');
  // Position Reply is
  // ok X:0.00 Y:0.00 Z:0.00 E:0.00 Count X:0.00 Y:0.00 Z:0.00 E:0.00 
}

example();
```

