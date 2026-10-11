import * as THREE from "three";

export class Input {
  direction: THREE.Vector3;
  sprinting: boolean;

  constructor() {
    this.direction = new THREE.Vector3();
    this.sprinting = false;

    document.addEventListener("keydown", this.onKeyDown)
    document.addEventListener("keyup", this.onKeyUp)
  }

  onKeyDown = (event: KeyboardEvent) => { this.onKey(event.code, true) }
  onKeyUp = (event: KeyboardEvent) => { this.onKey(event.code, false) }

  dispose() {
    document.removeEventListener("keydown", this.onKeyDown)
    document.removeEventListener("keyup", this.onKeyUp)
  }

  onKey(code: string, pressed: boolean) {
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
