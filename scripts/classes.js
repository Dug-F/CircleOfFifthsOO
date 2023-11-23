class Circle {
  constructor(parent, totalNodes) {
    this._parent = parent;
    this._totalNodes = totalNodes;
    this._noteGroups = [];
    this._tonicIndex = 0;
  }

  get parent() {
    return this._parent;
  }

  get totalNodes() {
    return this._totalNodes;
  }

  AddNoteGroup(noteGroup) {
    this._noteGroups.push(noteGroup);
  }

  getNoteGroupFromTonic() {
    return this._noteGroups.slice(this._tonicIndex).concat(this._noteGroups.slice(0, this._tonicIndex));
  }
}

class NoteGroup {
  constructor(arm, note, connector) {
    this._arm = arm;
    this._note = note;
    this._connector = connector;
  }

  get arm() {
    return this._arm;
  }

  get connector() {
    return this._connector;
  }

  get note() {
    return this._note;
  }

  set note(value) {
    this._note = value;
  }
}

class Arm {
  constructor(parent, position, totalNodes, length) {
    this._position = position;
    this._rotation = Math.round((360 / totalNodes) * position - 90);
    this._element = this._createElement(parent, length);
  }

  _createElement(parent, length) {
    const element = document.createElement("div");
    element.className = "arm";
    element.dataset.index = this.position;
    element.style.width = `${length}px`;

    gsap.set(element, { rotation: this.rotation });
    parent.appendChild(element);
    return element;
  }

  get element() {
    return this._element;
  }

  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }
}

class Connector {
  constructor(parent, position, totalNodes) {
    this._position = position;
    this._rotation = -Math.round((360 / totalNodes) * position - 90);
    this._element = this._createElement(parent);
  }

  _createElement(parent) {
    const element = document.createElement("div");
    element.className = "connector";
    element.dataset.index = this.position;

    gsap.set(element, { rotation: this.rotation });
    parent.appendChild(element);
    return element;
  }

  get element() {
    return this._element;
  }

  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }
}

class Note {
  constructor(parent, position, totalNodes, size) {
    this._position = position;
    this._rotation = -Math.round((360 / totalNodes) * position - 90);
    [this._element, this._text] = this._createElement(parent, size);
  }

  _createElement(parent, size) {
    const element = document.createElement("div");
    element.className = "note";
    element.dataset.index = this.position;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.top = `-${size / 2}px`;
    element.style.left = "100%";
    gsap.set(element, { rotation: this.rotation });
    const span = document.createElement("span");
    span.textContent = "";
    span.classList.add("text");
    element.appendChild(span);
    parent.appendChild(element);
    return [element, span];
  }

  get element() {
    return this._element;
  }

  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }

  set text(newText) {
    this._text.textContent = newText;
  }
}

const centre = document.querySelector("#centre");
const totalNodes = 12;
export const circle = new Circle(centre, totalNodes);

for (let i = 0; i < circle.totalNodes; i++) {
  const arm = new Arm(circle.parent, i, circle.totalNodes, 175);
  const note = new Note(arm.element, i, circle.totalNodes, 70);
  const connector = new Connector(arm.element, i, circle.totalNodes);
  const noteGroup = new NoteGroup(arm, note, connector);

  circle.AddNoteGroup(noteGroup);
}