#include <Arduino.h>

// Définition des broches
// Front Left Motor
#define F_in1 19
#define F_in2 21
// Front Right Motor
#define F_in3 22
#define F_in4 23

// Back Left Motor
#define B_in1 18
#define B_in2 17
// Back Right Motor
#define B_in3 16
#define B_in4 4



void forward() {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, HIGH);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, HIGH);

  digitalWrite(F_in3, LOW);
  digitalWrite(F_in4, HIGH);
  digitalWrite(B_in3, LOW);
  digitalWrite(B_in4, HIGH);
}

void reverse() {
  digitalWrite(F_in1, HIGH);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, HIGH);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in3, HIGH);
  digitalWrite(F_in4, LOW);
  digitalWrite(B_in3, HIGH);
  digitalWrite(B_in4, LOW);
}

void turn_left() {
  digitalWrite(F_in1, HIGH);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, HIGH);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in3, LOW);
  digitalWrite(F_in4, HIGH);
  digitalWrite(B_in3, LOW);
  digitalWrite(B_in4, HIGH);
}

void turn_right() {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, HIGH);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, HIGH);

  digitalWrite(F_in3, HIGH);
  digitalWrite(F_in4, LOW);
  digitalWrite(B_in3, HIGH);
  digitalWrite(B_in4, LOW);
}

void stop() {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in4, LOW);
  digitalWrite(F_in3, LOW);
  digitalWrite(B_in4, LOW);
  digitalWrite(B_in3, LOW);
}

void readSerialCommand() {
    if (Serial.available()) {
        String input = Serial.readStringUntil('\n');
        input.trim();
        char cmd = input.charAt(0);

        switch (cmd) {
          case 'F': forward(); break;
          case 'B': reverse(); break;
          case 'L': turn_left(); break;
          case 'R': turn_right(); break;
          case 'S': stop(); break;
    }        
    }
}

void setup() {
  Serial.begin(115200);
  Serial.println("GPIO setup");

  // Configurer les broches en sortie
  pinMode(F_in1, OUTPUT);
  pinMode(F_in2, OUTPUT);
  pinMode(F_in3, OUTPUT);
  pinMode(F_in4, OUTPUT);
  pinMode(B_in1, OUTPUT);
  pinMode(B_in2, OUTPUT);
  pinMode(B_in3, OUTPUT);
  pinMode(B_in4, OUTPUT);

  // Initialiser à LOW
  stop();
}

void loop() {
  readSerialCommand();
}