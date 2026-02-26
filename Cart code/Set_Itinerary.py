# Class ("set_itinerary") that can create a random itinerary 
# following the black line (e.g., go forward, stop, make a U-turn, go forward)
# Line_Navigate contains movement functions: run(duration),stop(), u_turn(), left(), right()

import random
from time import sleep
from gpiozero import Line_Navigate  


class Set_Itinerary:

    POSSIBLE_ACTIONS = ['forward', 'stop', 'u_turn', 'left', 'right']

    # by default there's no itinerary and we'll use 6 steps
    def __init__(self, itinerary=None, num_steps=6):
        if itinerary is None:
            self.itinerary = self.generate_random_itinerary(num_steps)
        else:
            self.itinerary = itinerary
        self.navigator = Line_Navigate()  # Initialize the movement controller

    def generate_random_itinerary(self, num_steps):
        # itinerary is a dictionnary
        itinerary = []
        for _ in range(num_steps):
            action = random.choice(self.POSSIBLE_ACTIONS)
            # add a random duration for the action forward 
            if action == "forward":
                entry = {"action": action, "duration": random.randint(3, 10)}  
            # Other ones don't have it 
            else:
                entry = {"action": action}  
            itinerary.append(entry)
        print(f"Generated itinerary: {itinerary}")
        return itinerary
    
    # by default 5sec 
    def forward(self, duration=5):
        print(f"Action: Forward for {duration} seconds")
        self.navigator.run(duration)

    def stop(self):
        print("Action: Stop")
        self.navigator.stop()

    def u_turn(self):
        print("Action: U-turn")
        self.navigator.u_turn()

    def left(self):
        print("Action: Left")
        self.navigator.left()

    def right(self):
        """Turns right."""
        print("Action: Right")
        self.navigator.right() 

    def run_itinerary(self):
        print("Starting itinerary execution...")
        for entry in self.itinerary:
            action = entry["action"]
            # for forward only
            duration = entry.get("duration") 
            if action == "forward":
                self.forward(duration)
            elif action == "stop":
                self.stop()
            elif action == "u_turn":
                self.u_turn()
            elif action == "left":
                self.left()
            elif action == "right":
                self.right()
            else:
                print(f"Unknown action: {action}")
            sleep(0.5)  # Small delay between actions
        print("Itinerary execution complete.")

# Main program:
if __name__ == '__main__':
    # custom itinerary 
    # itinerary [{action:value, OPTIONNAL duration: value},...]
    custom_itinerary = [
        {'action': 'forward', 'duration': 8},
        {'action': 'left'},
        {'action': 'forward', 'duration': 3},
        {'action': 'stop'},
        {'action': 'u_turn'},
        {'action': 'forward', 'duration': 5}
    ]
    # for test
    # set_itinerary = Set_Itinerary(itinerary=custom_itinerary)

    # random itinerary
    set_itinerary = Set_Itinerary(num_steps=7)
    set_itinerary.run_itinerary()



