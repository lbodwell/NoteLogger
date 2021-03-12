var binds={note1: "W", note2: "A", note3: "S", note4: "D"};
function readBind(b){
    if(b.toString().length === 1){
        return b;
    }
    else{
        throw new Error("Invalid binding; make sure that each field contains a character that maps to a key");
    }
}
function mapBinds(){

    binds.note1=readBind(document.getElementById("note_1").value);
    binds.note2=readBind(document.getElementById("note_2").value);
    binds.note3=readBind(document.getElementById("note_3").value);
    binds.note4=readBind(document.getElementById("note_4").value);
    if(binds.note1 === binds.note2 || binds.note1 === binds.note3 || binds.note1 === binds.note4 ||
    binds.note2 === binds.note3 || binds.note2 === binds.note4 ||
    binds.note3 === binds.note4){
        throw new Error("Invalid layout, make sure that each key is bound to only one note")
    }
    document.location="settings.html";
}