"""
Lecture simple de l'UID d'un tag MIFARE Classic 1K via SPI avec RST et IRQ

Connexion PN532 → Raspberry Pi (mode SPI)
-----------------------------------------
PN532   |  Raspberry Pi GPIO | Fonction
-----------------------------------------
VCC     →  3.3V (Pin 1)
GND     →  GND (Pin 6)
SCK     →  GPIO11 (Pin 23)   → SPI Clock
MOSI    →  GPIO10 (Pin 19)   → SPI Master Out Slave In
MISO    →  GPIO9  (Pin 21)   → SPI Master In Slave Out
SS/SDA  →  GPIO8  (Pin 24)   → Chip Select (CE0)
RSTO    →  GPIO22 (Pin 15)   → Reset pin
IRQ     →  GPIO25 (Pin 22)   → Interrupt (indique qu’un tag est détecté)
-----------------------------------------
"""

import time
import board
import busio
from digitalio import DigitalInOut
from adafruit_pn532.spi import PN532_SPI

# --- Configuration SPI sur Raspberry Pi ---
spi = busio.SPI(clock=board.SCK, MOSI=board.MOSI, MISO=board.MISO)

# Broche CS (Chip Select) reliée à GPIO8 (CE0)
cs_pin = DigitalInOut(board.D8)

# Broche RST (Reset) reliée à GPIO22
reset_pin = DigitalInOut(board.D22)

# Broche IRQ (Interrupt) reliée à GPIO25
irq_pin = DigitalInOut(board.D25)

# Création de l'objet PN532 SPI avec RST et IRQ
pn532 = PN532_SPI(spi, cs_pin, reset=reset_pin, irq=irq_pin, debug=False)

# Configuration du PN532 en mode normal
pn532.SAM_configuration()

print("En attente d'un tag RFID/NFC via SPI... (Ctrl+C pour quitter)")

try:
    while True:
        uid = pn532.read_passive_target(timeout=0.5)

        if uid is not None:
            print("Tag détecté ! UID :", [hex(b) for b in uid])
            print("UID concaténé :", ''.join("{:02X}".format(b) for b in uid))
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nArrêt du programme.")
