from flask import Flask, request
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import time

cred = credentials.Certificate("/Users/manalbaya/Desktop/CEG4912/CAP/Cart code/service-account.json")
initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

SIG = db.collection("signals").document("done")

def _set(doc):
    SIG.set(doc)

def _finalize_signal():
    # Briefly mark finished for UI if you still want that visual cue
    _set({"status": "finished", "phase": "idle"})
    time.sleep(1.0)
    _set({"status": False, "phase": "idle"})

@app.route("/go-to-cart", methods=["POST"])
def go_to_cart():
    data = request.get_json()
    items = data.get("items", [])
    total = len(items)
    print(f"🛒 Received cart: {items} ({total} items)")

    # Start fresh
    _set({"status": False, "phase": "moving", "current_index": 0, "total_items": total})

    for i, item in enumerate(items, start=1):
        print(f"\n➡️ Simulating movement to product {item} ({i}/{total})")
        # (Here you’d actually send the goal to the robot.)
        time.sleep(1)  # simulate travel

        # ARRIVED at item i
        _set({
            "status": False,
            "phase": "arrived",
            "current_index": i,     # we have arrived at i-th item
            "total_items": total
        })
        print("  ✅ Arrived. Waiting for NEXT or FINISHED…")

        # Wait for UI decision
        while True:
            signal = SIG.get().to_dict().get("status", False)
            print(f"  🔁 Firestore signal: {signal}")

            if signal is True:
                # user pressed NEXT → reset and continue
                print("  ▶️ NEXT received → continue to next item")
                _set({"status": False, "phase": "moving",
                      "current_index": i, "total_items": total})
                break

            elif signal == "finished":
                print("  🏁 FINISHED received → complete")
                _finalize_signal()
                return {"message": "All movements completed"}, 200

            time.sleep(0.4)

    print("\n🎉 All items completed.")
    _finalize_signal()
    return {"message": "All movements completed"}, 200

@app.route("/", methods=["GET"])
def index():
    return {"status": "Local Flask Simulation running"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
