import * as THREE from "three";

export class Input {
  constructor() {
    this.direction = new THREE.Vector3();
    this.sprinting = false;

    document.addEventListener("keydown", (event) => { this.onKey(event.code, true) })
    document.addEventListener("keyup", (event) => { this.onKey(event.code, false) })
  }

  onKey(code, pressed) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        this.direction.z = pressed ? -1 : 0;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.direction.x = pressed ? -1 : 0;
        break;
      case "KeyS":
      case "ArrowDown":
        this.direction.z = pressed ? 1 : 0;
        break;
      case "KeyD":
      case "ArrowRight":
        this.direction.x = pressed ? 1 : 0;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.sprinting = pressed ? true : false;
        break;
    }
  }

  get moving() {
    return !(this.direction.x === 0 && this.direction.z === 0)
  }
}
