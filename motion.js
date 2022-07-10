require("dotenv").config();
const express = require("express");
const app = express();
const port = 9800;
const WebSocket = require("ws");
const gpio = require("rpi-gpio");

const ws = new WebSocket(process.env.WEBSOCKET_SERVER_ADDRESS);

ws.on("open", function open() {
  console.log("Homebridge connection open.");
});

ws.on("message", function incoming(data) {
  console.log(data);
});

const sendMotionEvent = ({ value, name, characteristic }) => {
  ws.send(
    JSON.stringify({
      topic: "setValue",
      payload: {
        name,
        characteristic,
        value,
      },
    })
  );
};

gpio.on("change", function (channel, value) {
  if (value) {
    console.log("Motion detected");
    sendMotionEvent({
      name: process.env.MOTION_SENSOR_ID,
      characteristic: "MotionDetected",
      value: true,
    });
  } else {
    console.log("No motion detected");
    sendMotionEvent({
      name: process.env.MOTION_SENSOR_ID,
      characteristic: "MotionDetected",
      value: false,
    });
  }
});

gpio.setup(process.env.GPIO_PIN_ID, gpio.DIR_IN, gpio.EDGE_BOTH);

app.listen(port, () => console.log(`Motion Sensor running`));
