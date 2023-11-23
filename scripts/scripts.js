import {circle} from "./classes.js";

console.log(circle);

const allNotes = ["C", "G", "D", "A", "E", "B", "F♯/G♭", "C♯/D♭", "G♯/A♭", "D♯/E♭", "A♯/B♭", "F"];
circle.getNoteGroupFromTonic().forEach((group, i) => {
  group.note.text = allNotes[i];
});
