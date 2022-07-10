const express = require("express");
const app = express();
const port = 6700;
const WebSocket = require("ws");
const gpio = require("gpio");
const init = require("raspi");

const ws = new WebSocket("ws://192.168.1.118:9800/");

ws.on("open", function open() {
  console.log("Homebridge connection open.");
});

ws.on("message", function incoming(data) {
  console.log(data);
});

var gpio4 = gpio.export(11, {
  direction: gpio.DIRECTION.IN,
  interval: 200,
  ready: function () {
    gpio4.on("change", function (val) {
      setTimeout(() => {
        console.log(gpio4.value);
        if (gpio4.value === 1) {
          // statusLed.write(led.ON);
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
        } else {
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
      }, 300);
    });
  },
});

app.listen(port, () =>
  console.log(`Doorbell running on 192.168.124.126:${port}`)
);
