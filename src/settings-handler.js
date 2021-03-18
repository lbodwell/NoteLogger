const fs = require("fs");
const path = require("path");

const saveSettings = settings => {
	fs.writeFileSync(path.resolve(__dirname, "../settings.json"), JSON.stringify(settings));
}

const loadSettings = () => {
	const data = fs.readFileSync(path.resolve(__dirname, "../settings.json"));
	return JSON.parse(data);
}

const loadProfiles = () => {
	const data = fs.readFileSync(path.resolve(__dirname, "../profiles.json"));
	return JSON.parse(data);
}

module.exports = {saveSettings, loadSettings, loadProfiles};