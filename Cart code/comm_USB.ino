#include <Arduino.h>

void setup() {
    Serial.begin(115200);  // Communication USB série
    
    // Attendre que la connexion soit établie
    while (!Serial) {
      delay(5);
    }
    
    Serial.println("ESP32 prêt à communiquer via USB");
  }
  
  void loop() {
    // Lire les données reçues du Raspberry Pi
    if (Serial.available()) {
      String received = Serial.readStringUntil('\n');
      received.trim();
      
      Serial.print("Reçu: ");
      Serial.println(received);
  
      // Répondre au Raspberry Pi
      Serial.println("ESP32 a reçu: " + received);
    }
    
    delay(10); // Petit délai pour la stabilité
  }