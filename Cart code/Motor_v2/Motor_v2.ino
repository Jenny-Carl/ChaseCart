#include <Arduino.h>

// Direction pins for motor driver
// Front Left: 19, 21
#define F_in1 19
#define F_in2 21
// Back Left: 18, 17
#define B_in1 18
#define B_in2 17
// Front Right: 22, 23
#define F_in3 22
#define F_in4 23
// Back Right: 16, 4
#define B_in3 16
#define B_in4 4


const float WHEEL_BASE = 0.33; // meters (distance between wheels)

void stopAll() {
  int pins[] = {F_in1, F_in2, F_in3, F_in4, B_in1, B_in2, B_in3, B_in4};
  for (int pin : pins) digitalWrite(pin, LOW);
}

void setDirection(bool leftForward, bool rightForward) {
  digitalWrite(F_in1, leftForward ? LOW : HIGH);
  digitalWrite(F_in2, leftForward ? HIGH : LOW);
  digitalWrite(B_in1, leftForward ? LOW : HIGH);
  digitalWrite(B_in2, leftForward ? HIGH : LOW);

  digitalWrite(F_in3, rightForward ? LOW : HIGH);
  digitalWrite(F_in4, rightForward ? HIGH : LOW);
  digitalWrite(B_in3, rightForward ? LOW : HIGH);
  digitalWrite(B_in4, rightForward ? HIGH : LOW);
}

void handleVelocity(float linear, float angular) {
  float leftSpeed = linear - (angular * WHEEL_BASE / 2.0);
  float rightSpeed = linear + (angular * WHEEL_BASE / 2.0);
  setDirection(leftSpeed >= 0, rightSpeed >= 0);
  Serial.printf("Dir | L: %s R: %s\n",
                leftSpeed >= 0 ? "FWD" : "REV",
                rightSpeed >= 0 ? "FWD" : "REV");
}

void setup() {
  Serial.begin(115200);
  int pins[] = {F_in1, F_in2, F_in3, F_in4, B_in1, B_in2, B_in3, B_in4};
  for (int pin : pins) pinMode(pin, OUTPUT);
  stopAll();
  Serial.println("ESP32 ready (direction control only)");
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input.startsWith("V")) {
      float linear = 0.0, angular = 0.0;
      sscanf(input.c_str(), "V %f %f", &linear, &angular);
      handleVelocity(linear, angular);
    }
  }
}
