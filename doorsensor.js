const express = require('express');
const app = express();
const port = 6700;
const WebSocket = require('ws');
const gpio = require("gpio");
const init = require("raspi");
const led = require("raspi-led")

const ws = new WebSocket('ws://192.168.124.124:9700/');

ws.on('open', function open() {
    console.log("Homebridge connection open.")
});

ws.on('message', function incoming(data) {
    console.log(data);
});

// Calling export with a pin number will export that header and return a gpio header instance
var gpio4 = gpio.export(4, {
    direction: gpio.DIRECTION.IN,
    interval: 200,
    ready: function () {
        gpio4.on("change", function (val) {
            setTimeout(() => {
                console.log(gpio4.value);
                const statusLed = new led.LED();
                if (gpio4.value === 1) {
                    statusLed.write(led.ON);
                    ws.send(JSON.stringify({ "topic": "set", "payload": { "name": "DogDoorHandler", "characteristic": "MotionDetected", "value": true } }));
                }
                else {
                    statusLed.write(led.OFF);
                    ws.send(JSON.stringify({ "topic": "set", "payload": { "name": "DogDoorHandler", "characteristic": "MotionDetected", "value": false } }));
                }
            }, 300);
            // value will report either 1 or 0 (number) when the value changes

        });
    }
});



app.listen(port, () => console.log(`Doorbell running on 192.168.124.126:${port}`));