var settings = {
    instrument: "inst1",
    precision: 0,
    volume: 50,
    reverb: false,
    chorus: false,
    filter: false,
    delay: false
}

window.onload=function(){
    //load settings from json file
}


function saveSettings(){
    settings.instrument = document.getElementById("instruments").value;
    settings.precision = document.getElementById("precision").value;
    settings.volume = document.getElementById("volume").value;
    settings.reverb = document.getElementById("reverb").checked;
    settings.chorus = document.getElementById("chorus").checked;
    settings.filter = document.getElementById("filter").checked;
    settings.delay = document.getElementById("delay").checked;
    //TODO: save settings to json
}

document.getElementById("savesetbtn").onclick=function(){
    saveSettings();
    document.location='index.html';
}