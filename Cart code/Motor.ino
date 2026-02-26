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

void forward(int sec) {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, HIGH);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, HIGH);

  digitalWrite(F_in3, LOW);
  digitalWrite(F_in4, HIGH);
  digitalWrite(B_in3, LOW);
  digitalWrite(B_in4, HIGH);
  delay(sec * 1000);
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
  delay(sec * 1000);
}

void turn_left(int sec) {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, HIGH);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in3, HIGH);
  digitalWrite(F_in4, LOW);
  digitalWrite(B_in3, HIGH);
  digitalWrite(B_in4, LOW);
  delay(sec * 1000);
}

void stop(int sec) {
  digitalWrite(F_in1, LOW);
  digitalWrite(F_in2, LOW);
  digitalWrite(B_in1, LOW);
  digitalWrite(B_in2, LOW);

  digitalWrite(F_in4, LOW);
  digitalWrite(F_in3, LOW);
  digitalWrite(B_in4, LOW);
  digitalWrite(B_in3, LOW);
  delay(sec * 1000);
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
  stop(0);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');

    if (cmd == "F") {
      forward(5);
    } else if (cmd == "B") {
      reverse(3);
    } else if (cmd == "L") {
      turn_left(2);
    } else if (cmd == "S") {
      stop(3);
    } else {
      Serial.println("Commande inconnue.");
    }

    
    /* switch(command) {
      case 'F': // Avancer
        Serial.println("Commande : Avancer");
        forward(5);
        break;
       case 'B': // Reculer
        Serial.println("Commande : Reculer");
        reverse(3);
        break;
      case 'L': // Tourner à gauche
        Serial.println("Commande : Gauche");
        turn_left(2);
        break; 
      case 'S': // Stop
        Serial.println("Commande : Stop");
        stop(3);
        break; 
      default:
        Serial.println("Commande inconnue.");
    }
  } */
  }
}
