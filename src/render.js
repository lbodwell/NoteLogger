const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const playButton = document.getElementById("play-btn");
const settingsButton = document.getElementById("settings-btn");
const exitButton = document.getElementById("exit-btn");

let bpm = 120;
let synthType = "triangle";
let synthVolume = 1.0;

let noteSequence = [];

let settings;
let profiles; 
let bindings;

window.onload = () => {
	settings = window.electron.loadSettings();
	profiles = window.electron.loadProfiles();
	bindings = profiles[0].bindings;
	console.log(profiles);
	console.log(bindings);
	// TODO: add bindings to dropdown
}

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
	pitch = bindings[key];
	
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