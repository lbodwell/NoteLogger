const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const playButton = document.getElementById("play-btn");
const settingsButton = document.getElementById("settings-btn");
const exitButton = document.getElementById("exit-btn");

let bpm = 150;
let synthType = "fatsawtooth";
let synthVolume = 1.0;
let inputMode = "mouse";

let noteSequence = [];
let keyboardBindings = {
	"Z": "C4",
	"X": "D4",
	"C": "E4",
	"V": "F4",
	"B": "G4",
	"N": "A4",
	"M": "B4",
	",": "C5",
	".": "D5",
	"/": "E5",
	"S": "Cs4",
	"D": "Ds4",
	"G": "Fs4",
	"H": "Gs4",
	"J": "As4",
	"L": "Cs5",
	";": "Ds5",
	"Q": "C5",
	"W": "D5",
	"E": "E5",
	"R": "F5",
	"T": "G5",
	"Y": "A5",
	"U": "B5",
	"I": "C6",
	"O": "D6",
	"P": "E6",
	"[": "F6",
	"]": "G6",
	"2": "Cs5",
	"3": "Ds5",
	"5": "Fs5",
	"6": "Gs5",
	"7": "As5",
	"9": "Cs6",
	"0": "Ds6",
	"=": "Fs6",
};
let mouseBindings = {
	"MouseLeft": "C4",
	"MouseRight": "D4",
	"MouseMiddle": "E4",
	"MouseX1": "G4",
	"MouseX2": "A4"
};

startButton?.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.startKeyLogger();
});

stopButton?.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.stopKeyLogger();
});

playButton?.addEventListener("click", evt => {
	evt.preventDefault();
	if (Tone.Transport.state !== "started") {
		Tone.Transport.start();
	} else {
		Tone.Transport.stop();
	}
	Tone.Transport.bpm.value = bpm;
	const logContents = window.electron.readLog();
	noteSequence = [];
	logContents.forEach((line, index) => {
		let nextLine;
		if (index < logContents.length - 1) {
			nextLine = logContents[index + 1];
		}
		const pitch = getPitch(line);
		const duration = getDuration(line, nextLine);
		let time = 0;
		if (index > 0 ) {
			const lastNote = noteSequence[index - 1];
			const timeSeconds = Tone.Time(lastNote.time).toSeconds() + Tone.Time(lastNote.duration).toSeconds();
			time = Tone.Time(timeSeconds).toBarsBeatsSixteenths();
		}
		if (pitch) {
			noteSequence.push({pitch, duration, time});
		}
		
	});
	const synth = new Tone.Synth({
		oscillator : {
			volume: synthVolume,
			count: 3,
			spread: 40,
			type : synthType
		  }
	}).toDestination();
	const part = new Tone.Part((time, note) => {
		synth.triggerAttackRelease(note.pitch, note.duration, time);
	}, noteSequence);
	part.start();

});

settingsButton?.addEventListener("click", evt => {
	evt.preventDefault();
	document.location="settings.html";
});

exitButton?.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.exit();
});

const getPitch = line => {
	let pitch;
	const key = line.substring(line.indexOf(": ") + 2).trim();
	if (inputMode === "keyboard") {
		if (keyboardBindings.hasOwnProperty(key)) {
			pitch = keyboardBindings[key];
		}
	} else if (inputMode === "mouse") {
		if (mouseBindings.hasOwnProperty(key)) {
			pitch = mouseBindings[key];
		}
	}
	
	
	return pitch;
};

const getDuration = (line, nextLine) => {
	let duration = "1m";
	if (nextLine) {
		const timestamp1 = line.substring(line.indexOf(" ") + 1, line.indexOf(": ") + 1);
		const hours1 = timestamp1.substring(0, timestamp1.indexOf(":"));
		const minutes1 = timestamp1.substring(timestamp1.indexOf(":") + 1, nthIndexOf(timestamp1, ":", 2));
		const seconds1 = timestamp1.substring(nthIndexOf(timestamp1, ":", 2) + 1, timestamp1.indexOf(","));
		const millis1 = timestamp1.substring(timestamp1.indexOf(",") + 1, nthIndexOf(timestamp1, ":", 3));
		
		const timestamp2 = nextLine.substring(nextLine.indexOf(" ") + 1, nextLine.indexOf(": ") + 1);
		const hours2 = timestamp2.substring(0, timestamp2.indexOf(":"));
		const minutes2 = timestamp2.substring(timestamp2.indexOf(":") + 1, nthIndexOf(timestamp2, ":", 2));
		const seconds2 = timestamp2.substring(nthIndexOf(timestamp2, ":", 2) + 1, timestamp2.indexOf(","));
		const millis2 = timestamp2.substring(timestamp2.indexOf(",") + 1, nthIndexOf(timestamp2, ":", 3));

		hoursDelta = (parseFloat(hours2) - parseFloat(hours1)) * 3600;
		minutesDelta = (parseFloat(minutes2) - parseFloat(minutes1)) * 60;
		secondsDelta = parseFloat(seconds2) - parseFloat(seconds1);
		millisDelta = (parseFloat(millis2) - parseFloat(millis1)) / 1000.0;

		delta = hoursDelta + minutesDelta + secondsDelta + millisDelta;
		duration = Tone.Time(delta).toNotation();
	}

	return duration;
};

const nthIndexOf = (str, pattern, n) => {
	let i = -1;

	while (n-- && i++ < str.length) {
		i = str.indexOf(pattern, i);
		if (i < 0) {
			break;
		}
	}

	return i;
}