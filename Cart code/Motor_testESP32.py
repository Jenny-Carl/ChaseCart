import RPi.GPIO as GPIO
from time import sleep
import serial

GPIO.setwarnings(False)
print("GPIO Clean up")
GPIO.cleanup()


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

r=GPIO.PWM(F_en_a,1000)
s=GPIO.PWM(F_en_b,1000)
q=GPIO.PWM(B_en_a,1000)
p=GPIO.PWM(B_en_b,1000)
r.start(100)
s.start(100)
p.start(100)
q.start(100)


# Wrap main content in a try block so we can  catch the user pressing CTRL-C and run the
# GPIO cleanup function. This will also prevent the user seeing lots of unnecessary error messages.

def wait_for_done():
    """ Waits until "Done!" is received from ESP32"""
    while True:
        if ser.in_waiting > 0:
            response = ser.readline().decode().rstrip() #read response
            print(f"ESP32 Response: {response}")
            if response == "Done!":
                break

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
    sleep(1)  # Wait for ESP32 to initialize
    ser.reset_input_buffer()

    #motor = Motor_test()
    print('forward')
    ser.write(b"F\n")  # Send 'F' for Forward
    wait_for_done()
    #print('Stop')
    #ser.write(b"S\n")  # Send 'S' to Stop
    #sleep(2)
    print('backward')
    ser.write(b"B\n")  #Send 'B' for Backward
    wait_for_done()
    
    print('Turning left')
    ser.write(b"L\n")  #Send 'B' for Backward
    wait_for_done()
    
    ser.close()
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
