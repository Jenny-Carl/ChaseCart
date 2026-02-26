#!/usr/bin/env python3
import rospy
from geometry_msgs.msg import Twist
import time

# ========================================================
#            L I D A R     (RPLIDAR A2)
# ========================================================
from rplidar import RPLidar

LIDAR_PORT = "/dev/ttyUSB1"
OBSTACLE_DIST = 0.45  # meters

try:
    lidar = RPLidar(LIDAR_PORT)
except:
    print("ERROR: Could not connect to RPLIDAR on", LIDAR_PORT)
    exit(1)


def is_obstacle():
    """Return True if obstacle detected within OBSTACLE_DIST."""
    for scan in lidar.iter_scans(max_buf_meas=True):
        for (_, angle, dist) in scan:
            d = dist / 1000.0  # convert mm → m
            # Check ~front zone 0° ± 40°
            if 0 <= angle <= 40 or 320 <= angle <= 360:
                if d < OBSTACLE_DIST:
                    return True
        return False


# ========================================================
#                  R F I D   (PN532 SPI)
# ========================================================
import board
import busio
from digitalio import DigitalInOut
from adafruit_pn532.spi import PN532_SPI

# SPI bus
spi = busio.SPI(clock=board.SCK, MOSI=board.MOSI, MISO=board.MISO)

# Pins
cs_pin    = DigitalInOut(board.D8)   # CE0
reset_pin = DigitalInOut(board.D22)
irq_pin   = DigitalInOut(board.D25)

pn532 = PN532_SPI(spi, cs_pin, reset=reset_pin, irq=irq_pin, debug=False)
pn532.SAM_configuration()


def read_rfid():
    """Return UID as hex string or None."""
    uid = pn532.read_passive_target(timeout=0.1)
    if uid:
        return ''.join("{:02X}".format(x) for x in uid)
    return None


# ========================================================
#            R O S   /cmd_vel   publisher
# ========================================================
cmd_pub = None


def send_vel(lin, ang):
    """Publish a ROS Twist velocity command."""
    twist = Twist()
    twist.linear.x = lin
    twist.angular.z = ang
    cmd_pub.publish(twist)


# ========================================================
#              C H E C K P O I N T S
# ========================================================
CHECKPOINT_UIDS = [
    "A17F29A3",
    "A18129A3",
    "A18329A3",
    "918529A3",
    "A18729A3",
    "918929A3",
    "818B29A3",
    "818D29A3",
    "A18F29A3",
    "919129A3"
]

current_checkpoint = 0
MOVING_SPEED = 0.10  # m/s


# ========================================================
#                 M A I N   N A V I G A T I O N
# ========================================================
def main_nav():
    global current_checkpoint

    print("\n===============================")
    print("   RFID + LIDAR NAVIGATION")
    print("===============================")
    print(f"Starting navigation. Target UID: {CHECKPOINT_UIDS[current_checkpoint]}")
    print()

    while current_checkpoint < len(CHECKPOINT_UIDS):

        # ------------------------------
        # 1. RFID CHECK
        # ------------------------------
        tag = read_rfid()
        if tag:
            print(f"RFID detected: {tag}")

            if tag == CHECKPOINT_UIDS[current_checkpoint]:
                print(f"Checkpoint {current_checkpoint+1} reached!")
                send_vel(0, 0)
                time.sleep(1)

                current_checkpoint += 1

                if current_checkpoint >= len(CHECKPOINT_UIDS):
                    print("🎯 Final destination reached.")
                    send_vel(0, 0)
                    break

                print(f"➡️ Next checkpoint UID: {CHECKPOINT_UIDS[current_checkpoint]}")
                time.sleep(1)
                continue  # resume movement

        # ------------------------------
        # 2. OBSTACLE AVOIDANCE (WAIT)
        # ------------------------------
        if is_obstacle():
            print("🛑 Obstacle detected → STOP & WAIT")
            send_vel(0, 0)

            # stay until clear
            while is_obstacle():
                time.sleep(0.1)

            print("✔ Path clear → moving again")
            send_vel(MOVING_SPEED, 0.0)
            continue

        # ------------------------------
        # 3. NORMAL FORWARD MOVEMENT
        # ------------------------------
        send_vel(MOVING_SPEED, 0.0)
        time.sleep(0.05)

    # ------------------------------
    # END OF NAVIGATION
    # ------------------------------
    print("Navigation complete. Stopping robot.")
    send_vel(0, 0)

    lidar.stop()
    lidar.disconnect()


# ========================================================
#                   R O S   N O D E
# ========================================================
if __name__ == "__main__":
    rospy.init_node("rfid_lidar_nav", anonymous=True)
    cmd_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=10)

    try:
        time.sleep(1)
        main_nav()

    except KeyboardInterrupt:
        print("Manual interrupt. Stopping.")
        send_vel(0, 0)
        lidar.stop()
        lidar.disconnect()
