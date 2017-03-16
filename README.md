### Motion Controller Emulator

The purpose of this module is to allow for proper testing of code that utilizes gcode-based motion control hardware. We're specifically focused on emulating Marlin firmware, however this software's purpose can be expanded more generally as well.  

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

