const {contextBridge, ipcRenderer} = require("electron");
const {startKeyLogger, stopKeyLogger, readLog} = require("./key-logger-handler");
const {saveSettings, loadSettings, loadProfiles} = require("./settings-handler.js");

const exit = () => {
	ipcRenderer.send("close");
};

contextBridge.exposeInMainWorld("electron", {
	startKeyLogger,
	stopKeyLogger,
	readLog,
	saveSettings,
	loadSettings,
	loadProfiles,
	exit
});