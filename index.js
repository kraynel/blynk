const blynkLib = require("blynk-library"); //1
const { Imu, Joystick, Leds } = require("node-sense-hat");

const IMU = new Imu.IMU();
const AUTH = process.env.BLYNK_TOKEN;

// Setup Blynk
const blynk = new blynkLib.Blynk(AUTH);

const sendValue = (err, readout) => {
  if (err !== null) {
    console.error("Could not read data: ", err);
  }

  blynk.virtualWrite(4, readout.temperature.toFixed(1)); //5
  blynk.virtualWrite(3, readout.humidity.toFixed(1));

  //   console.log("Temperature:", readout.temperature.toFixed(1) + "C"); //6
  //   console.log("Humidity:   ", readout.humidity.toFixed(1) + "%");

  setTimeout(() => IMU.getValue(sendValue), 2000);
};

Joystick.getJoystick().then(joystick => {
  joystick.on("press", direction => {
    console.log("Joystick pressed in " + direction + " direction");
    IMU.getValue((err, data) => {
      const fontColor = direction === "left" ? [255, 0, 0] : [0, 0, 255];
      const message =
        direction === "left"
          ? `Temp: ${data.temperature.toFixed(1)} C`
          : `Humidity: ${data.humidity.toFixed(1)} %`;
      Leds.showMessage(message, 0.05, fontColor, undefined, Leds.clear);
    });
  });
});

// Automatically update sensor value every 2 seconds
IMU.getValue(sendValue);

