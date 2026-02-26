# ultrasonic.py
#import RPi.GPIO as GPIO
from gpiozero import DistanceSensor
#import time

class UltrasonicSensor:
    def __init__(self, trig_pin, echo_pin):
        self.sensor = DistanceSensor(echo=echo_pin, trigger=trig_pin, max_distance=3)
    def get_distance(self):
        # gpiozero retourne une valeur entre 0 et 1 (proportion)
        distance_cm = self.sensor.distance * 100
        return round(distance_cm, 1)
