from main_control import main_control
import time

ctrl = main_control()


def test_ultrasonic_servo():
    try:
        while True:
            for direction in ["center"]:
                dist = ctrl.measure_at(direction)
                print(f"{direction.capitalize()} : {dist} cm")
                time.sleep(2)
    except KeyboardInterrupt:
        ctrl.cleanup()

def test_ir_sensors():
    print("Test : Capteurs infrarouges (suivi de ligne)")
    try:
        while True:
            left = ctrl.IR01_sensor.value
            middle = ctrl.IR02_sensor.value
            right = ctrl.IR03_sensor.value

            if not left and middle and not right:
                print("→ Ligne au milieu")
            elif not left and not middle and right:
                print("→ Ligne à droite")
            elif left and not middle and not right:
                print("→ Ligne à gauche")
            elif not left and not middle and not right:
                print("→ Aucune ligne détectée")
            elif left and right:
                print("→ Ligne large (ou croisement)")
            time.sleep(0.2)
    except KeyboardInterrupt:
        print("\nFin du test.")


def test_follow_line():
    print("Test : Suivi de ligne")
    try:
        while True:
            ctrl.follow_line()
            time.sleep(0.2)
    except KeyboardInterrupt:
        ctrl.cleanup()
        print("Arrêt manuel")


def test_obstacle_avoidance():
    print("Test : Évitement d'obstacles")
    try:
        while True:
            center = ctrl.measure_at("center")

            print(f"Centre: {center}")

            if center <= 20:
                ctrl.emergency_Stop()
                left = ctrl.measure_at("left")
                right = ctrl.measure_at("right")
                #ctrl.avoid_obstacle(left, right)
            else:
                ctrl.follow_line()

            time.sleep(0.2)
    except KeyboardInterrupt:
        ctrl.cleanup()
        print("Arrêt manuel")


if __name__ == '__main__':

    test_obstacle_avoidance()

    """  print("=== Menu de test ===")
        print("1 - Test Ultrason + Servo")
        print("2 - Test Suivi de ligne")
        print("3 - Test Complet (suivi + obstacle)")
        
        choix = input("Choix : ")

        if choix == "1":
            test_ultrasonic_servo()
        elif choix == "2":
            test_follow_line()
        elif choix == "3":
            test_obstacle_avoidance()
        elif choix == "4":
            test_ir_sensors()
        else:
            print("Choix invalide") """
