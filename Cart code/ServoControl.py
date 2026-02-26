import RPi.GPIO as GPIO
import time

class ServoControl:
    def __init__(self, pin):
        self.pin = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)

        self.servo = GPIO.PWM(self.pin, 50)  # 50 Hz pour servo standard
        self.servo.start(0)  # Démarre à 0% de rapport cyclique
        time.sleep(0.5)

    def set_position(self, direction):
        angle_map = {
            "left": 150,
            "center": 90,
            "right": 30
        }
        if direction not in angle_map:
            print("Direction invalide")
            return

        angle = angle_map[direction]
        duty = angle_to_duty_cycle(angle)

        print(f"Position {direction} → angle {angle}° → duty {duty:.2f}%")
        self.servo.ChangeDutyCycle(duty)
        time.sleep(0.4)
        self.servo.ChangeDutyCycle(0)  # Stop signal pour éviter les vibrations

def angle_to_duty_cycle(angle):
        # Convertit un angle en duty cycle (valeurs typiques pour servo 0°–180°)
        # 0° → 2.5% ; 180° → 12.5%
        return 2.5 + (angle / 180.0) * 10.0

if __name__ == '__main__':
    SERVO_PIN = 17  
    serv = ServoControl(SERVO_PIN)

    try:
        #serv.set_position("center")
        #print("Servo au centre")
        #time.sleep(3)
        while True:
            serv.set_position("left")
            print("Servo à gauche")
            time.sleep(3)
        
            serv.set_position("center")
            print("Servo au centre")
            time.sleep(3)

            serv.set_position("right")
            print("Servo à droite")
            time.sleep(3)

    except KeyboardInterrupt:
        serv.servo.stop()
        GPIO.cleanup()
        print("Fin du test.")