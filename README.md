# ChaseCart — Autonomous Shopping Cart

**Raspberry Pi 4B • ROS • LiDAR • Firestore • React Web App • ESP32 Motor Control**

ChaseCart is an **autonomous indoor navigation robot** designed to follow a user’s shopping list, fetch items one-by-one, and navigate a store environment using LiDAR, wheel encoders, RFID sensor, and a real-time map. 

The system integrates **Raspberry Pi (ROS1)**, **ESP32**, **React frontend**, and **Firebase Firestore** for real-time coordination.

---

## Project Overview

ChaseCart automates the shopping experience by allowing users to select products from a web interface.
The Raspberry Pi retrieves product coordinates, generates navigation goals using ROS, and controls the robot through the ESP32 motor subsystem.

✔ User selects items via the website

✔ Shopping list stored in Firestore

✔ Flask server on Pi monitors Firestore signals (`NEXT`, `FINISHED`)

✔ ROS sends navigation goals to `/move_base`

✔ Cart moves toward each product location

✔ ESP32 controls motors

✔ LiDAR performs SLAM mapping


