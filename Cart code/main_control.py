# main_control.py
from time import sleep
import serial
import RPi.GPIO as GPIO
from UltrasonicSensor import UltrasonicSensor
from ServoControl import ServoControl
from gpiozero import LineSensor

GPIO.setwarnings(False)
GPIO.cleanup()
#print("GPIO Clean up")

class main_control:
    def __init__(self):
        GPIO.setwarnings(False)
        GPIO.cleanup()
        print("GPIO Clean up")
        
        TRIG = 6
        ECHO = 17
        SERVO_PIN = 27
        self.sensor = UltrasonicSensor(TRIG, ECHO)
        self.servo = ServoControl(SERVO_PIN)

        LEFT_SENSOR = 20
        MIDDLE_SENSOR = 16
        RIGHT_SENSOR = 26
        self.IR01_sensor = LineSensor(LEFT_SENSOR)
        self.IR02_sensor = LineSensor(MIDDLE_SENSOR)
        self.IR03_sensor = LineSensor(RIGHT_SENSOR)

        # Communication série vers ESP32
        self.ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
        sleep(1)
        self.ser.reset_input_buffer()

        # Front Left Motor
        F_en_a = 12
        # Front Right Motor
        F_en_b = 18

        # Back Left Motor
        B_en_a = 19
        # Back Right Motor
        B_en_b = 13


        GPIO.setmode(GPIO.BCM)
        GPIO.setup(F_en_a,GPIO.OUT)
        GPIO.setup(B_en_a,GPIO.OUT)

        GPIO.setup(F_en_b,GPIO.OUT)
        GPIO.setup(B_en_b,GPIO.OUT)

        self.frontL_wheel = GPIO.PWM(F_en_a,1000)
        self.frontR_wheel = GPIO.PWM(F_en_b,1000)
        self.backL_wheel = GPIO.PWM(B_en_a,1000)
        self.backR_wheel = GPIO.PWM(B_en_b,1000)
        self.frontL_wheel.start(0)
        self.frontR_wheel.start(0)
        self.backL_wheel.start(0)
        self.backR_wheel.start(0)
    
    def cleanup(self):
        GPIO.cleanup()
        
    def emergency_Stop(self):
        self.set_motor_speed(0, 0, 0, 0)
        self.ser.write(b"S\n")

    def set_motor_speed(self, speedFL, speedFR, speedBL, speedBR):
        self.frontL_wheel.ChangeDutyCycle(speedFL)
        self.frontR_wheel.ChangeDutyCycle(speedFR)
        self.backL_wheel.ChangeDutyCycle(speedBL)
        self.backR_wheel.ChangeDutyCycle(speedBR)

    def measure_at(self, direction):
        self.servo.set_position(direction)
        return self.sensor.get_distance()

    def get_line_position(self):
        LMR = 0x00
        if self.IR01_sensor.value:
            LMR |= 4
        if self.IR02_sensor.value:
            LMR |= 2
        if self.IR03_sensor.value:
            LMR |= 1
        return LMR

    def follow_line(self):
        LMR = self.get_line_position()

        if LMR == 2:
            self.set_motor_speed(75, 75, 75, 75)
            self.ser.write(b"F\n")  # Avancer
        elif LMR == 4:
            self.set_motor_speed(40, 80, 40, 80)
            self.ser.write(b"L\n")  # Tourner gauche
        elif LMR == 6:
            self.set_motor_speed(60, 80, 60, 80)
            self.ser.write(b"L\n")  # Tourner gauche
        elif LMR==1:
            self.set_motor_speed(80, 40, 80, 40)
            self.ser.write(b"R\n")  # Tourner droite
        elif LMR == 3:
            self.set_motor_speed(80, 60, 80, 60)
            self.ser.write(b"R\n")  # Tourner droite
        elif LMR == 7 or LMR == 0:
            self.set_motor_speed(0, 0, 0, 0)
            self.ser.write(b"S\n")  # Stop : perdu la ligne

    def avoid_obstacle(self, left_distance, right_distance):
        print("Obstacle détecté → évitement en cours")

        # Reculer légèrement
        self.ser.write(b"B\n")
        sleep(0.8)

        if left_distance >= right_distance:
            # Tourner à gauche
            self.ser.write(b"L\n")
            sleep(0.8)
            self.ser.write(b"F\n")
            sleep(0.8)
            self.ser.write(b"R\n")
        else:
            # Tourner à droite
            self.ser.write(b"R\n")
            sleep(0.8)
            self.ser.write(b"F\n")
            sleep(0.8)
            self.ser.write(b"L\n")

        sleep(0.3)

        # Avancer doucement jusqu'à retrouver la ligne
        while not (self.IR01_sensor.value or self.IR02_sensor.value or self.IR03_sensor.value):
            self.ser.write(b"F\n")

            if left_distance >= right_distance:
                self.ser.write(b"R\n")
            else:
                self.ser.write(b"L\n")
        self.follow_line()
    

