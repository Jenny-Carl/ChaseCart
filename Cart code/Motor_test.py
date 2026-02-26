import RPi.GPIO as GPIO
from time import sleep
import serial

GPIO.setwarnings(False)
print("GPIO Clean up")


# Front Left Motor
F_in1 = 22
F_in2 = 23
F_en_a = 12
# Front Right Motor
F_in3 = 24
F_in4 = 25
F_en_b = 18

# Back Left Motor
B_in1 = 17
B_in2 = 27
B_en_a = 19
# Back Right Motor
B_in3 = 5
B_in4 = 6
B_en_b = 13


GPIO.setmode(GPIO.BCM)
GPIO.setup(F_in1,GPIO.OUT)
GPIO.setup(F_in2,GPIO.OUT)
GPIO.setup(F_en_a,GPIO.OUT)
GPIO.setup(B_in1,GPIO.OUT)
GPIO.setup(B_in2,GPIO.OUT)
GPIO.setup(B_en_a,GPIO.OUT)

GPIO.setup(F_in3,GPIO.OUT)
GPIO.setup(F_in4,GPIO.OUT)
GPIO.setup(F_en_b,GPIO.OUT)
GPIO.setup(B_in3,GPIO.OUT)
GPIO.setup(B_in4,GPIO.OUT)
GPIO.setup(B_en_b,GPIO.OUT)

r=GPIO.PWM(F_en_a,100)
s=GPIO.PWM(F_en_b,100)
q=GPIO.PWM(B_en_a,100)
p=GPIO.PWM(B_en_b,100)
r.start(100)
s.start(100)
p.start(100)
q.start(100)

GPIO.output(F_in1,GPIO.LOW)
GPIO.output(F_in2,GPIO.LOW)
GPIO.output(F_in4,GPIO.LOW)
GPIO.output(F_in3,GPIO.LOW)
GPIO.output(B_in1,GPIO.LOW)
GPIO.output(B_in2,GPIO.LOW)
GPIO.output(B_in4,GPIO.LOW)
GPIO.output(B_in3,GPIO.LOW)

# Wrap main content in a try block so we can  catch the user pressing CTRL-C and run the
# GPIO cleanup function. This will also prevent the user seeing lots of unnecessary error messages.

class Motor_test:
    def forward(self, sec):
        GPIO.output(F_in1, GPIO.LOW)
        GPIO.output(F_in2, GPIO.HIGH)
        GPIO.output(B_in1, GPIO.LOW)
        GPIO.output(B_in2, GPIO.HIGH)

        GPIO.output(F_in4, GPIO.HIGH)
        GPIO.output(F_in3, GPIO.LOW)
        GPIO.output(B_in4, GPIO.HIGH)
        GPIO.output(B_in3, GPIO.LOW)
        sleep(sec)  # Changed from time.sleep()

    def reverse(self, sec):
        GPIO.output(F_in1, GPIO.HIGH)
        GPIO.output(F_in2, GPIO.LOW)
        GPIO.output(B_in1, GPIO.HIGH)
        GPIO.output(B_in2, GPIO.LOW)

        GPIO.output(F_in4, GPIO.LOW)
        GPIO.output(F_in3, GPIO.HIGH)
        GPIO.output(B_in4, GPIO.LOW)
        GPIO.output(B_in3, GPIO.HIGH)
        sleep(sec)

    def turn_left_inPlace(self, sec):
        GPIO.output(F_in1, GPIO.HIGH)
        GPIO.output(F_in2, GPIO.LOW)
        GPIO.output(B_in1, GPIO.HIGH)
        GPIO.output(B_in2, GPIO.LOW)

        GPIO.output(F_in4, GPIO.HIGH)
        GPIO.output(F_in3, GPIO.LOW)
        GPIO.output(B_in4, GPIO.HIGH)
        GPIO.output(B_in3, GPIO.LOW)
        sleep(sec)
    
    def turn_left(self, sec):
        GPIO.output(F_in1, GPIO.LOW)
        GPIO.output(F_in2, GPIO.LOW)
        GPIO.output(B_in1, GPIO.HIGH)
        GPIO.output(B_in2, GPIO.LOW)

        GPIO.output(F_in4, GPIO.HIGH)
        GPIO.output(F_in3, GPIO.LOW)
        GPIO.output(B_in4, GPIO.HIGH)
        GPIO.output(B_in3, GPIO.LOW)
        sleep(sec)

    def turn_right_inPlace(self, sec):
        GPIO.output(F_in1, GPIO.LOW)
        GPIO.output(F_in2, GPIO.HIGH)
        GPIO.output(B_in1, GPIO.LOW)
        GPIO.output(B_in2, GPIO.HIGH)

        GPIO.output(F_in4, GPIO.LOW)
        GPIO.output(F_in3, GPIO.HIGH)
        GPIO.output(B_in4, GPIO.LOW)
        GPIO.output(B_in3, GPIO.HIGH)
        sleep(sec)

    def turn_right(self, sec):
        GPIO.output(F_in1, GPIO.LOW)
        GPIO.output(F_in2, GPIO.HIGH)
        GPIO.output(B_in1, GPIO.LOW)
        GPIO.output(B_in2, GPIO.HIGH)

        GPIO.output(F_in4, GPIO.LOW)
        GPIO.output(F_in3, GPIO.LOW)
        GPIO.output(B_in4, GPIO.LOW)
        GPIO.output(B_in3, GPIO.HIGH)
        sleep(sec)

    def stop(self, sec):
        GPIO.output(F_in1, GPIO.LOW)
        GPIO.output(F_in2, GPIO.LOW)
        GPIO.output(B_in1, GPIO.LOW)
        GPIO.output(B_in2, GPIO.LOW)

        GPIO.output(F_in4, GPIO.LOW)
        GPIO.output(F_in3, GPIO.LOW)
        GPIO.output(B_in4, GPIO.LOW)
        GPIO.output(B_in3, GPIO.LOW)
        sleep(sec)

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
    sleep(2)  # Wait for ESP32 to initialize

    #motor = Motor_test()
    ser.write(b"F\n")  # Send 'F' for Forward
    sleep(1)
    ser.write(b"S\n")  # Send 'S' to Stop
    sleep(1)
    # try:
    #     print('forward')
    #     motor.forward(5)
    #     print('Back')
    #     motor.reverse(3)
    #     print("Turn left")
    #     motor.turn_left(5)
    #     print("Turn right")
    #     motor.turn_right
    #     print('Stop')
    #     motor.stop(3)
    # except KeyboardInterrupt:
    #     # Reset GPIO settings
    #     GPIO.cleanup()
    #     print("GPIO Clean up")
