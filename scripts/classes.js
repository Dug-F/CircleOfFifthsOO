class Circle {
  constructor(parent, totalNodes) {
    this._parent = parent;
    this._totalNodes = totalNodes;
    this._groups = {};
    this._tonicIndex = 0;
  }

  rotateTo(groups) {
    groups.forEach((group, i) => {
      group.rotateTo(i);
    });
  }

  get groups() {
    return this._groups;
  }

  get parent() {
    return this._parent;
  }

  get tonicIndex() {
    return this._tonicIndex;
  }

  get totalNodes() {
    return this._totalNodes;
  }

  set tonicIndex(value) {
    this._tonicIndex = value;
  }

  /**
   * @description Adds (if key does not exist already) or appends (if key exists) a group to the groups container by key.
   * @param {string} groupKey
   * @param {NoteGroup[]} group
   * @returns {undefined}
   */
  addGroup(key, group) {
    if (this.groups.hasOwnProperty(key)) {
      this.groups[key].push(group);
      return;
    }
    this.groups[key] = [group];
  }

  /**
   * @description returns group by key, starting from index 0
   * @param {string} key
   * @returns {Group[]}
   */
  getGroups(key) {
    return this.groups[key];
  }

  /**
   * @description returns group by key, starting from the passed index and wrapping around to provide all elements
   * @param {string} key
   * @param {number} index
   * @returns {Group[]}
   */
  getGroupsFromIndex(key, index) {
    return this.groups[key].slice(index).concat(this.groups[key].slice(0, index));
  }
}

class Group {
  constructor(position, arm, main, connector, totalNodes) {
    this._position = position;
    this._totalNodes = totalNodes;
    this._rotation = Math.round((360 / totalNodes) * position - 90);
    this._arm = arm;
    this._main = main;
    this._connector = connector;
  }

  get arm() {
    return this._arm;
  }

  get connector() {
    return this._connector;
  }

  get main() {
    return this._main;
  }

  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }

  get totalNodes() {
    return this._totalNodes;
  }

  set main(value) {
    this._main = value;
  }

  set position(value) {
    this._position = value;
  }

  set rotation(value) {
    this._rotation = value;
  }

  rotateTo(position) {
    const moveDistance = this.position >= position ? this.position - position : this.position + 12 - position;
    const [directionPri, directionSec] = moveDistance <= 6 ? ["_ccw", "_cw"] : ["_cw", "_ccw"];
    this.position = position;
    this.rotation = Math.round((360 / this.totalNodes) * position - 90);
    gsap.to(this.arm.element, { rotation: `${this.rotation}${directionPri}`, duration: 2 });
    gsap.to(this.main.element, { rotation: `${-this.rotation}${directionSec}`, duration: 2 });
    gsap.to(this.connector.element, { rotation: `${-this.rotation}${directionSec}`, duration: 2 });
  }
}

class Arm {
  constructor(parent, className, index, rotation, length) {
    this._element = this._createElement(parent, className, index, rotation, length);
  }

  _createElement(parent, className, index, rotation, length) {
    const element = document.createElement("div");
    element.className = className;
    element.dataset.index = index;
    element.style.width = `${length}px`;

    gsap.set(element, { rotation: rotation });
    parent.appendChild(element);
    return element;
  }

  get element() {
    return this._element;
  }
}

class Connector {
  constructor(parent, index, rotation) {
    this._element = this._createElement(parent, index, rotation);
  }

  _createElement(parent, index, rotation) {
    const element = document.createElement("div");
    element.className = "connector";
    element.dataset.index = index;

    gsap.set(element, { rotation: rotation });
    parent.appendChild(element);
    return element;
  }

  get element() {
    return this._element;
  }
}

class Main {
  /**
   * @description constructor for main element in group (i.e. the element that has the text)
   * @param {HTMLElement} parent parent HTML element to which the new element is to be appended
   * @param {string} className class to be added to the HTML element
   * @param {number} index index of the object
   * @param {number} rotation rotation to be applied to the object
   * @param {number} size single number for width and height of the HTML element
   */
  constructor(parent, className, index, rotation, size) {
    [this._element, this._text] = this._createElement(parent, className, index, rotation, size);
  }

  _createElement(parent, className, index, rotation, size) {
    const element = document.createElement("div");
    element.className = className;
    element.dataset.index = index;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.top = `-${size / 2}px`;
    element.style.left = "100%";
    gsap.set(element, { rotation: rotation });
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

  set text(newText) {
    this._text.textContent = newText;
  }
}

const centre = document.querySelector("#centre");
const totalNodes = 12;
export const circle = new Circle(centre, totalNodes);

for (let i = 0; i < circle.totalNodes; i++) {
  const rotation = Math.round((360 / totalNodes) * i - 90);

  const noteArm = new Arm(circle.parent, 'arm', i, rotation, 175);
  const noteMain = new Main(noteArm.element, "note", i, -rotation, 70);
  const noteConnector = new Connector(noteArm.element, i, -rotation);
  const noteGroup = new Group(i, noteArm, noteMain, noteConnector, circle.totalNodes);
  circle.addGroup("notes", noteGroup);

  const labelArm = new Arm(circle.parent, 'arm', i, rotation, 280);
  const labelMain = new Main(labelArm.element, "label", i, -rotation, 50);
  const labelConnector = new Connector(labelArm.element, i, -rotation);
  const labelGroup = new Group(i, labelArm, labelMain, labelConnector, circle.totalNodes);
  circle.addGroup("labels", labelGroup);
}
