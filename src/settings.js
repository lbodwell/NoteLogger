const saveButton = document.getElementById("save-btn");

let settings = {
	instrument: "inst1",
	precision: 0,
	volume: 50,
	reverb: false,
	chorus: false,
	filter: false,
	delay: false
}

window.onload = () => {
	settings = window.electron.loadSettings();
	document.getElementById("instruments").value = settings.instrument;
	document.getElementById("precision").value = settings.precision;
	document.getElementById("volume").value = settings.volume;
	document.getElementById("reverb").checked = settings.reverb;
	document.getElementById("chorus").checked = settings.chorus;
	document.getElementById("filter").checked = settings.filter;
	document.getElementById("delay").checked = settings.delay;
};

saveButton?.addEventListener("click", () => {
	settings.instrument = document.getElementById("instruments")?.value;
	settings.precision = document.getElementById("precision")?.value;
	settings.volume = document.getElementById("volume")?.value;
	settings.reverb = document.getElementById("reverb")?.checked;
	settings.chorus = document.getElementById("chorus")?.checked;
	settings.filter = document.getElementById("filter")?.checked;
	settings.delay = document.getElementById("delay")?.checked;
	window.electron.saveSettings(settings);
	document.location = "index.html";
});