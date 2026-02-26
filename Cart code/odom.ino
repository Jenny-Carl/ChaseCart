// Pins for encoder sensors
#define LEFT_ENCODER 32
#define RIGHT_ENCODER 33

// Encoder parameters
#define SLOTS 20              // number of slots in the disc
#define WHEEL_DIAMETER 0.065  // wheel diameter in meters (example 67 mm)

volatile int leftPulses = 0;
volatile int rightPulses = 0;

unsigned long lastTime = 0;
float wheelCircumference = WHEEL_DIAMETER * 3.1416;

void IRAM_ATTR onLeftPulse() {
  leftPulses++;
}

void IRAM_ATTR onRightPulse() {
  rightPulses++;
}

void setup() {
  Serial.begin(115200);
  pinMode(LEFT_ENCODER, INPUT_PULLUP);
  pinMode(RIGHT_ENCODER, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(LEFT_ENCODER), onLeftPulse, FALLING);
  attachInterrupt(digitalPinToInterrupt(RIGHT_ENCODER), onRightPulse, FALLING);

  lastTime = millis();
}

void loop() {
  unsigned long now = millis();

  if (now - lastTime >= 1000) { // every 1s
    noInterrupts();
    int leftCount = leftPulses;
    int rightCount = rightPulses;
    leftPulses = 0;
    rightPulses = 0;
    interrupts();

    // Calculate revolutions
    float leftRevs = (float)leftCount / SLOTS;
    float rightRevs = (float)rightCount / SLOTS;

    // Calculate distance
    float leftDist = leftRevs * wheelCircumference;
    float rightDist = rightRevs * wheelCircumference;

    // Calculate speed (m/s)
    float leftSpeed = leftDist / ((now - lastTime) / 1000.0);
    float rightSpeed = rightDist / ((now - lastTime) / 1000.0);

    // Print results
    Serial.printf("L:%d R:%d | LD:%.3f m RD:%.3f m | LS:%.3f m/s RS:%.3f m/s\n",
                  leftCount, rightCount,
                  leftDist, rightDist,
                  leftSpeed, rightSpeed);

    lastTime = now;
  }
}
