import time
import pygame
import pygame.midi

class Note:
	def __init__(self, pitch, duration):
		self.pitch = pitch
		self.duration = duration

BPM = 120

input_mappings = {
	"W": 60,
	"A": 62,
	"S": 64,
	"D": 65,
	"R": 67,
	"F": 69,
	"Q": 71,
	"Tab": 72,
	"Shift": 74,
	"Esc": 76,
	"MouseLeft": 77,
	"MouseRight": 79,
	"MouseMiddle": 81,
	"MouseX1": 83,
	"MouseX2": 84
}

notes = []

def determine_pitch(line):
	pitch = None

	input = line[(line.find(": ") + 2):].strip("\n")
	if (input in input_mappings):
		pitch = input_mappings[input]

	return pitch

def determine_duration(line, next_line):
	duration = 4

	if (next_line != None):
		timestamp1 = line[(line.find(" ") + 1):(line.find(": "))]
		hours1 = timestamp1[0:(timestamp1.find(":"))]
		minutes1 = (timestamp1[(timestamp1.find(":") + 1):])[0:timestamp1.find(":")]
		seconds1 = (timestamp1[(timestamp1.find(":") + 1):])[(timestamp1.find(":") + 1):(timestamp1.find(",") - 3)]
		millis1 = timestamp1[(timestamp1.find(",") + 1):]

		timestamp2 = next_line[(next_line.find(" ") + 1):(next_line.find(": "))]
		hours2 = timestamp2[0:(timestamp2.find(":"))]
		minutes2 = (timestamp2[(timestamp2.find(":") + 1):])[0:timestamp2.find(":")]
		seconds2 = (timestamp2[(timestamp2.find(":") + 1):])[(timestamp2.find(":") + 1):(timestamp2.find(",") - 3)]
		millis2 = timestamp2[(timestamp2.find(",") + 1):]

		hours_delta = (float(hours2) - float(hours1)) * 3600
		minutes_delta = (float(minutes2) - float(minutes1)) * 60
		seconds_delta = float(seconds2) - float(seconds1)
		millis_delta = (float(millis2) - float(millis1)) / 1000.0
		
		delta = hours_delta + minutes_delta + seconds_delta + millis_delta
		beat = 60.0 / BPM

		if (delta < beat * 3):
			duration = 2
		if (delta < beat * 1.5):
			duration = 1
		if (delta < beat * 0.75):
			duration = 0.5
		if (delta < beat * 0.375):
			duration = 0.25

	return duration

def play_notes():
	pygame.midi.init()
	player = pygame.midi.Output(7)
	player.set_instrument(0)

	for note in notes:
		if (note.pitch != None):
			player.note_on(note.pitch, 127)
		time.sleep((60 / BPM) * note.duration)
		if (note.pitch != None):
			player.note_off(note.pitch, 127)

	del player
	pygame.midi.quit()

def convert_notes(output):
	for index, line in enumerate(output):
		next_line = None
		if (index < len(output) - 1):
			next_line = output[index + 1]
		notes.append(Note(determine_pitch(line), determine_duration(line, next_line)))                                                                                

with open("log.txt", "r") as file:
	convert_notes(file.readlines())

play_notes()