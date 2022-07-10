const express = require("express");
const app = express();
const port = 9800;
const WebSocket = require("ws");
const gpio = require("rpi-gpio");

const ws = new WebSocket("ws://192.168.1.118:9800/");

ws.on("open", function open() {
  console.log("Homebridge connection open.");
});

ws.on("message", function incoming(data) {
  console.log(data);
});

gpio.on("change", function (channel, value) {
  if (value) {
    console.log("Motion detected")
    ws.send(
      JSON.stringify({
        topic: "setValue",
        payload: {
          name: "WorkbenchMotionSensor",
          characteristic: "MotionDetected",
          value: true,
        },
      })
    );
  }
  else{
    console.log("No motion detected")
    ws.send(
      JSON.stringify({
        topic: "setValue",
        payload: {
          name: "WorkbenchMotionSensor",
          characteristic: "MotionDetected",
          value: false,
        },
      })
    );
  }
});

gpio.setup(11, gpio.DIR_IN, gpio.EDGE_BOTH);

app.listen(port, () =>
  console.log(`Motion Sensor running on 192.168.1.118:${port}`)
);
