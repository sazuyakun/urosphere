import * as THREE from "three";

export class Input {
  direction: THREE.Vector3;
  sprinting: boolean;
  pressed: Set<string>;

  constructor() {
    this.direction = new THREE.Vector3();
    this.sprinting = false;
    this.pressed = new Set();
  }

  // Listeners are attached separately from construction so React StrictMode can
  // disconnect and reconnect the same instance.
  connect() {
    document.addEventListener("keydown", this.onKeyDown)
    document.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("blur", this.onBlur)
  }

  onKeyDown = (event: KeyboardEvent) => { this.onKey(event.code, true) }
  onKeyUp = (event: KeyboardEvent) => { this.onKey(event.code, false) }
  onBlur = () => {
    this.pressed.clear()
    this.update()
  }

  disconnect() {
    document.removeEventListener("keydown", this.onKeyDown)
    document.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("blur", this.onBlur)
    this.onBlur()
  }

  onKey(code: string, pressed: boolean) {
    if (pressed) {
      this.pressed.add(code)
    } else {
      this.pressed.delete(code)
    }
    this.update()
  }

  isDown(...codes: string[]) {
    return codes.some((code) => this.pressed.has(code)) ? 1 : 0
  }

  update() {
    this.direction.x = this.isDown("KeyD", "ArrowRight") - this.isDown("KeyA", "ArrowLeft")
    this.direction.z = this.isDown("KeyS", "ArrowDown") - this.isDown("KeyW", "ArrowUp")
    this.sprinting = this.isDown("ShiftLeft", "ShiftRight") === 1
  }

  get moving() {
    return !(this.direction.x === 0 && this.direction.z === 0)
  }
}
