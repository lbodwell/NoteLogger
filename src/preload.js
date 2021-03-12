const {contextBridge, ipcRenderer} = require("electron");
const {startKeyLogger, stopKeyLogger, readLog} = require("./key-logger-handler");

const exit = () => {
	ipcRenderer.send("close");
}

contextBridge.exposeInMainWorld("electron", {
	startKeyLogger,
	stopKeyLogger,
	readLog,
	exit
});