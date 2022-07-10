const express = require("express");
const app = express();
const port = 9800;
const WebSocket = require("ws");
const gpio = require("gpio");

const ws = new WebSocket("ws://192.168.1.118:9800/");

ws.on("open", function open() {
  console.log("Homebridge connection open.");
});

ws.on("message", function incoming(data) {
  console.log(data);
});

var PIN = gpio.export(11, {
  direction: gpio.DIRECTION.OUT,
  interval: 200,
  ready: function () {
    PIN.on("change", function (val) {
      console.log(val);
      //   setTimeout(() => {
      //     console.log(PIN.value);
      //     if (PIN.value === 1) {
      //       // statusLed.write(led.ON);
      //       ws.send(
      //         JSON.stringify({
      //           topic: "setValue",
      //           payload: {
      //             name: "WorkbenchMotionSensor",
      //             characteristic: "MotionDetected",
      //             value: true,
      //           },
      //         })
      //       );
      //     } else {
      //       ws.send(
      //         JSON.stringify({
      //           topic: "setValue",
      //           payload: {
      //             name: "WorkbenchMotionSensor",
      //             characteristic: "MotionDetected",
      //             value: false,
      //           },
      //         })
      //       );
      //     }
      //   }, 300);
    });
  },
});

app.listen(port, () =>
  console.log(`Motion Sensor running on 192.168.1.118:${port}`)
);
