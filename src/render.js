const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const playButton = document.getElementById("play-btn");

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
	logContents.forEach(line => {
		console.log(line);
	});
	// TODO: process log contents into notes
});