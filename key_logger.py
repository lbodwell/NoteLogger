import logging

from pynput.keyboard import Key
from pynput.keyboard import Listener as KeyListener
from pynput.mouse import Listener as MouseListener

STOP_HOTKEY = Key.f4

logging.basicConfig(filename = ("log.txt"), level = logging.DEBUG, format="%(asctime)s: %(message)s")

with open("log.txt", "w"):
	pass

def on_press(key):
	if key != STOP_HOTKEY:
		write_output(str(key).replace("'", "").replace("Key.", "").capitalize())

def on_release(key):
	if key == STOP_HOTKEY:
		return False

def on_click(x, y, button, pressed):
	if pressed:
		write_output("Mouse" + str(button).replace("Button.", "").capitalize())
	
def write_output(output):
	print(output)
	logging.info(output)

with MouseListener(on_click = on_click) as listener:
	with KeyListener(on_press = on_press, on_release = on_release) as listener:
		listener.join()