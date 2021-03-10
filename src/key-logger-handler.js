const fs = require("fs");
const path = require("path");
const {contextBridge} = require("electron");
const {spawn} = require("child_process");

let keyLogger;
let loggerRunning = false;

const startKeyLogger = () => {
	if (!loggerRunning) {
		console.log("Starting key logger");
		keyLogger = spawn("python", ["key_logger.py"]);
		loggerRunning = true;
		keyLogger.on("exit", () => {
			keyLogger = null;
			loggerRunning = false;
			console.log("Key logger stopped");
		});
	}
};

const stopKeyLogger = () => {
	if (loggerRunning) {
		console.log("Stopping key logger");
		keyLogger.kill("SIGINT");
	}
};

const readLog = () => {
	if (!loggerRunning) {
		console.log("Reading log file");
		// TODO: error handling
		const contents = fs.readFileSync(path.join(__dirname, "../log.txt"));
		console.log(contents.toString());
	}
};

contextBridge.exposeInMainWorld("electron", {
	startKeyLogger,
	stopKeyLogger,
	readLog
});