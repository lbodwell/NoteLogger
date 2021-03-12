class Note {
	constructor(pitch, duration) {
		this.pitch = pitch;
		this.duration = duration;
	}
}

const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const playButton = document.getElementById("play-btn");
const settingsButton = document.getElementById("settings-btn");
const exitButton = document.getElementById("exit-btn");

let bpm = 120;
let inputMappings = {};
let noteSequence = [];

startButton.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.startKeyLogger();
});

stopButton.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.stopKeyLogger();
});

playButton.addEventListener("click", evt => {
	evt.preventDefault();
	const logContents = window.electron.readLog();
	logContents.forEach((line, index) => {
		console.log(line);
		let nextLine;
		if (index < logContents.length - 1) {
			nextLine = logContents[index + 1];
		}
		noteSequence.push(new Note(getPitch(line), getDuration(line, nextLine)));
	});
	Tone.Transport.bpm.value = bpm;
	const synth = new Tone.Synth().toDestination();

	const now = Tone.now();
	noteSequence.forEach(note => {
		synth.triggerAttackRelease(note.pitch, note.duration);
		// wait
	});
});

settingsButton.addEventListener("click", evt => {
	evt.preventDefault();
	document.location="settings.html";
});

exitButton.addEventListener("click", evt => {
	evt.preventDefault();
	window.electron.exit();
});

const getPitch = line => {
	let pitch = "C5";

	return pitch;
};

const getDuration = (line, nextLine) => {
	let duration = "1m";
	if (nextLine) {

	}

	return duration;
};