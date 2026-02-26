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

unsigned long moveStartTime = 0;  // Time when movement starts
unsigned long moveDuration = 0;   // Duration of movement
bool moving = false;              // Flag to track movement status
char currentCommand = 'S';        // Default: Stop

void forward(int sec) {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, HIGH);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, HIGH);

  digitalWrite(F_in3, LOW);
  digitalWrite(F_in4, HIGH);
  digitalWrite(B_in3, LOW);
  digitalWrite(B_in4, HIGH);
  
  moveStartTime = millis();  // Record start time
  moveDuration = sec * 1000; // Convert seconds to milliseconds
  moving = true;
  currentCommand = 'F';
}

void reverse(int sec) {
  digitalWrite(F_in1, HIGH);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, HIGH);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in3, HIGH);
  digitalWrite(F_in4, LOW);
  digitalWrite(B_in3, HIGH);
  digitalWrite(B_in4, LOW);
  
  moveStartTime = millis();  // Record start time
  moveDuration = sec * 1000; // Convert seconds to milliseconds
  moving = true;
  currentCommand = 'B';
}

void turn_left(int sec) {
  digitalWrite(F_in1, HIGH);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, HIGH);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in3, LOW);
  digitalWrite(F_in4, HIGH);
  digitalWrite(B_in3, LOW);
  digitalWrite(B_in4, HIGH);
  
  moveStartTime = millis();  // Record start time
  moveDuration = sec * 1000; // Convert seconds to milliseconds
  moving = true;
  currentCommand = 'L';
}

void turn_righ(int sec) {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, HIGH);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, HIGH);

  digitalWrite(F_in3, HIGH);
  digitalWrite(F_in4, LOW);
  digitalWrite(B_in3, HIGH);
  digitalWrite(B_in4, LOW);
  
  moveStartTime = millis();  // Record start time
  moveDuration = sec * 1000; // Convert seconds to milliseconds
  moving = true;
  currentCommand = 'R';
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
  
  moving = false;
  currentCommand = 'S';
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
  if (Serial.available() && !moving) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd == "F") {
      forward(5);
    } else if (cmd == "B") {
      reverse(3);
    } else if (cmd == "L") {
      turn_left(2);
    } else if (cmd == "S") {
      stop();
    } else {
      Serial.println("Commande inconnue.");
    }

  }

  if (moving && millis() - moveStartTime >= moveDuration) {
        stop();
        Serial.println("Done!");
    }
}