#!/usr/bin/env python3
"""
Raspberry Pi Flask + ROS server for ChaseCart navigation.
Receives cart items from the web frontend (via Firestore),
fetches coordinates from Firestore, and sends navigation
goals to the ROS move_base stack one by one.
"""

from flask import Flask, request
from flask_cors import CORS
import rospy, time
from geometry_msgs.msg import PoseStamped
from firebase_admin import credentials, firestore, initialize_app

# Firebase initialization
cred = credentials.Certificate("/home/pi/service-account.json")  # adjust path
initialize_app(cred)
db = firestore.client()
SIG = db.collection("signals").document("done")

# ROS initialization
rospy.init_node("cart_navigation_server", anonymous=True)
pub = rospy.Publisher("/move_base_simple/goal", PoseStamped, queue_size=10)

app = Flask(__name__)
CORS(app)

def send_goal(x, y, theta=0.0):
    """Publish a PoseStamped goal to /move_base_simple/goal."""
    goal = PoseStamped()
    goal.header.frame_id = "map"
    goal.header.stamp = rospy.Time.now()
    goal.pose.position.x = x
    goal.pose.position.y = y
    goal.pose.orientation.w = 1.0
    pub.publish(goal)
    rospy.loginfo(f"Sent goal: x={x:.2f}, y={y:.2f}, θ={theta:.2f}")

def _set_signal(doc):
    SIG.set(doc)

def _finalize_signal():
    """Mark finished briefly, then reset."""
    _set_signal({"status": "finished", "phase": "idle"})
    rospy.loginfo("Firestore set to 'finished'")
    time.sleep(1.0)
    _set_signal({"status": False, "phase": "idle"})
    rospy.loginfo("Firestore reset to idle")

# Flask routes
@app.route("/go-to-cart", methods=["POST"])
def go_to_cart():
    """
    Expected JSON body:
    {
        "items": ["toothpaste", "milk", "bread"]
    }
    """
    try:
        data = request.get_json()
        items = data.get("items", [])
        total = len(items)

        rospy.loginfo(f"Received cart: {items} ({total} items)")

        # Start clean session
        _set_signal({
            "status": False,
            "phase": "moving",
            "current_index": 0,
            "total_items": total
        })

        for i, item_id in enumerate(items, start=1):
            rospy.loginfo(f"\nMoving to {item_id} ({i}/{total})")

            # --- Fetch product from Firestore ---
            product_ref = db.collection("products").document(item_id)
            doc = product_ref.get()
            if not doc.exists:
                rospy.logwarn(f"Product {item_id} not found in Firestore")
                continue

            product = doc.to_dict()
            pos = product.get("position")
            if not pos:
                rospy.logwarn(f"Product {item_id} missing 'position' field")
                continue

            # --- Send navigation goal ---
            send_goal(pos["x"], pos["y"], pos.get("theta", 0.0))

            # --- Update Firestore: "moving" phase ---
            _set_signal({
                "status": False,
                "phase": "moving",
                "current_index": i - 1,
                "total_items": total
            })

            # Simulate travel time or wait for robot confirmation if needed
            time.sleep(1)

            # --- Mark arrived ---
            _set_signal({ 
                "status": False,
                "phase": "arrived",
                "current_index": i,
                "total_items": total,
                "current_product": item_id
            })
            rospy.loginfo(f"Arrived at {item_id}. Waiting for Next/Finish...")

            # --- Wait for UI signal ---
            while True:
                doc = SIG.get()
                data = doc.to_dict() if doc.exists else {}
                signal = data.get("status", False)

                if signal is True:
                    rospy.loginfo("NEXT received → continuing...")
                    _set_signal({
                        "status": False,
                        "phase": "moving",
                        "current_index": i,
                        "total_items": total
                    })
                    break

                elif signal == "finished":
                    rospy.loginfo("FINISHED received → ending early.")
                    _finalize_signal()
                    return {"message": "Navigation stopped early"}, 200

                time.sleep(0.5)

        rospy.loginfo("All products visited!")
        _finalize_signal()
        return {"message": "All movements completed"}, 200

    except Exception as e:
        rospy.logerr(f"Error in go_to_cart: {e}")
        return {"error": str(e)}, 500

@app.route("/", methods=["GET"])
def index():
    return {"status": "ChaseCart Raspberry Pi Server running"}, 200

# Run Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)
