import serial

# Adjust this to your ESP32 port
PORT = "/dev/ttyUSB0"   # sometimes /dev/ttyUSB1 or /dev/ttyAMA0
BAUD = 115200

def parse_line(line):
    try:
        # Example: "L:24 R:25 | LD:0.631 m RD:0.657 m | LS:0.631 m/s RS:0.657 m/s"
        parts = line.split("|")

        # Left & right pulses
        lr = parts[0].strip().split()
        left_pulses = int(lr[0].split(":")[1])
        right_pulses = int(lr[1].split(":")[1])

        # Distances
        dist = parts[1].strip().split()
        left_dist = float(dist[0].split(":")[1])
        right_dist = float(dist[1].split(":")[1])

        # Speeds
        speeds = parts[2].strip().split()
        left_speed = float(speeds[0].split(":")[1])
        right_speed = float(speeds[1].split(":")[1])

        return {
            "left_pulses": left_pulses,
            "right_pulses": right_pulses,
            "left_distance": left_dist,
            "right_distance": right_dist,
            "left_speed": left_speed,
            "right_speed": right_speed
        }

    except Exception as e:
        print(f"Parse error: {e} | Line: {line}")
        return None


def main():
    ser = serial.Serial(PORT, BAUD, timeout=1)
    print(f"Listening on {PORT} at {BAUD} baud...")

    while True:
        line = ser.readline().decode("utf-8").strip()
        if not line:
            continue

        data = parse_line(line)
        if data:
            print(f"🔹 Pulses → L:{data['left_pulses']} R:{data['right_pulses']}")
            print(f"🔹 Distance → L:{data['left_distance']:.3f} m R:{data['right_distance']:.3f} m")
            print(f"🔹 Speed → L:{data['left_speed']:.3f} m/s R:{data['right_speed']:.3f} m/s")
            print("------------------------------------------------------")


if __name__ == "__main__":
    main()
