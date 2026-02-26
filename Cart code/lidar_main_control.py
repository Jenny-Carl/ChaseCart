#!/usr/bin/env python3
import rospy
from geometry_msgs.msg import Twist
import serial
import RPi.GPIO as GPIO
from time import sleep

""" linear.x angular.z
0.1 0.0   → move forward (0.1 m/s, no rotation)
0.0 1.0   → turn in place (no forward motion, rotate)
0.0 0.0   → stop
v 1.0 0.0 
ROS-style velocity commands (v <linear> <angular>) """


# --- Motor enable pins (connected to Pi) ---
F_en_a = 12   # Front Left
F_en_b = 18   # Front Right
B_en_a = 19   # Back Left
B_en_b = 13   # Back Right

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

for pin in [F_en_a, F_en_b, B_en_a, B_en_b]:
    GPIO.setup(pin, GPIO.OUT)

# Create PWM objects
frontL_pwm = GPIO.PWM(F_en_a, 1000)
frontR_pwm = GPIO.PWM(F_en_b, 1000)
backL_pwm  = GPIO.PWM(B_en_a, 1000)
backR_pwm  = GPIO.PWM(B_en_b, 1000)

for pwm in [frontL_pwm, frontR_pwm, backL_pwm, backR_pwm]:
    pwm.start(0)

# --- Serial link to ESP32 ---
# NEED TO CHECK THIS USB PORT
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
sleep(1)
ser.reset_input_buffer()

MAX_SPEED = 0.15  # m/s (robot top speed)
MAX_PWM = 100

def cmd_vel_callback(msg):
    linear = msg.linear.x
    angular = msg.angular.z

    # Send velocity command to ESP32
    cmd = f"v {linear:.2f} {angular:.2f}\n"
    ser.write(cmd.encode())

    # Convert magnitude to PWM duty cycle
    pwm_value = min(abs(linear) / MAX_SPEED * MAX_PWM, MAX_PWM)

    # Apply to all motors
    for motor in [frontL_pwm, frontR_pwm, backL_pwm, backR_pwm]:
        motor.ChangeDutyCycle(pwm_value)

    rospy.loginfo(f"Sent: {cmd.strip()} | PWM: {pwm_value:.1f}%")

def main():
    rospy.init_node('lidar_motor_control', anonymous=True)
    rospy.Subscriber('/cmd_vel', Twist, cmd_vel_callback)
    rospy.spin()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        for pwm in [frontL_pwm, frontR_pwm, backL_pwm, backR_pwm]:
            pwm.ChangeDutyCycle(0)
        GPIO.cleanup()
        ser.close()
