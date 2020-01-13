const express = require('express');
const app = express();
const port = 6700;
const WebSocket = require('ws');
const gpio = require("gpio");
const led = require("raspi-led");
const pm2 = require('pm2');

const ws = new WebSocket('ws://192.168.124.124:9700/');

ws.on('open', function open() {
    console.log("Homebridge connection open.")
});

ws.on('message', function incoming(data) {
    console.log(data);
});

pm2.connect(function (err) {
    if (err) throw err;

    setTimeout(function worker() {
        console.log("Restarting app...");
        pm2.restart('doorsensor', function () { });
        setTimeout(worker, 3600000);
    }, 3600000);
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
                    ws.send(JSON.stringify({ "topic": "set", "payload": { "name": "OfficeDoorContactSensor", "characteristic": "ContactSensorState", "value": 1 } }));
                }
                else {
                    statusLed.write(led.OFF);
                    ws.send(JSON.stringify({ "topic": "set", "payload": { "name": "OfficeDoorContactSensor", "characteristic": "ContactSensorState", "value": 0 } }));
                }
            }, 300);
        });
    }
});



app.listen(port, () => console.log(`Doorbell running on 192.168.124.126:${port}`));
