import { circle } from "./classes.js";

const allNotes = ["C", "G", "D", "A", "E", "B", "F♯/G♭", "C♯/D♭", "G♯/A♭", "D♯/E♭", "A♯/B♭", "F"];
const allNotesLabels = ["Tonic", "Perfect\n5th", "Major\n2nd", "Major\n6th", "Major\n3rd", "Major\n7th", "♭5\nTritone", "Minor\n2nd", "Minor\n6th", "Minor\n3rd", "Minor\n7th", "Perfect\n4th"];
circle.getGroupsFromIndex("notes", circle.tonicIndex).forEach((group, i) => {
  group.main.text = allNotes[i];
});

circle.getGroupsFromIndex("labels", circle.tonicIndex).forEach((group, i) => {
  group.main.text = allNotesLabels[i];
});

export function rotateArm() {
  circle.rotateTo(circle.getGroupsFromIndex("notes", circle.tonicIndex));
}

function noteClicked(event) {
  const index = Number(event.target.dataset.index)
  circle.rotateTo(circle.getGroupsFromIndex('notes', index))
}

circle.getGroups('notes').forEach((group) => {
  group.main.element.addEventListener("click", noteClicked);
});

// document.querySelector(".rotateArmTest").addEventListener("click", () => {
//   rotateArm();
// })
