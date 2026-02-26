import serial
import time
import RPi.GPIO as GPIO

ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)  
time.sleep(2)  # Laisser le temps à la connexion série de s'établir

# Configuration des pins pour le capteur ultrasonique
TRIG = 6
ECHO = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

def get_distance():
    GPIO.output(TRIG, False)
    time.sleep(0.0002)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    while GPIO.input(ECHO) == 0:
        start = time.time()
    while GPIO.input(ECHO) == 1:
        end = time.time()

    duration = end - start
    distance = duration * 34300 / 2
    return round(distance, 1)

try:
    while True:
        dist = get_distance()
        print(f"Distance: {dist} cm")

        if dist < 20:
            print("Obstacle détecté ! Stop")
            ser.write(b"S\n")
        else:
            print("Aucun obstacle. Avancer")
            ser.write(b"F\n")

        time.sleep(1)

except KeyboardInterrupt:
    GPIO.cleanup()
    ser.write(b"S\n")
    print("Programme arrêté proprement")
