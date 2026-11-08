import * as THREE from "three";
import { shortestAngleDelta } from "./angles";

// Free orbit camera like Genshin Impact or Zelda. See docs/ART_DIRECTION.md section 3.
const LOOK_HEIGHT = 1.5; // aims at the character's chest, not the feet
const DEFAULT_DISTANCE = 5;
const MIN_DISTANCE = 2.5;
const MAX_DISTANCE = 8;
// Pitch is how far the camera sits above the character: positive looks down.
const DEFAULT_PITCH = THREE.MathUtils.degToRad(15);
const MIN_PITCH = THREE.MathUtils.degToRad(-10);
const MAX_PITCH = THREE.MathUtils.degToRad(70);
// Keeps the camera above the ground so it never sees the ground edge-on.
const MIN_CAMERA_HEIGHT = 0.3;
const RECENTER_KEY = "KeyC";
const RECENTER_DONE = 0.01;
// Some browsers report wheel movement in lines instead of pixels.
const PIXELS_PER_WHEEL_LINE = 16;

// Click the game to capture the mouse, then moving it turns the camera with no
// button held. Esc releases it. Dragging also turns the camera while the mouse
// isn't captured. Scroll or pinch zooms. C swings the camera back behind the
// character. The camera never moves by itself otherwise.
export class ThirdPersonCamera {
  // Radians per pixel of mouse movement. Becomes a player setting later, since
  // trackpads and mice feel very different.
  MOUSE_SENSITIVITY = 0.0025;
  // Metres of zoom per pixel of scroll.
  ZOOM_SENSITIVITY = 0.005;
  ZOOM_SMOOTHING = 12;
  RECENTER_SPEED = 10;

  yaw = 0;
  pitch = DEFAULT_PITCH;
  distance = DEFAULT_DISTANCE;
  targetDistance = DEFAULT_DISTANCE;
  recentering = false;
  dragging = false;
  element: HTMLElement | null = null;
  focus = new THREE.Vector3();

  // Listeners are attached here, not in the constructor, so React StrictMode
  // can disconnect and reconnect the same instance.
  connect(element: HTMLElement) {
    this.element = element;
    element.addEventListener("pointerdown", this.onPointerDown);
    element.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("keydown", this.onKeyDown);
  }

  disconnect() {
    const element = this.element;
    if (!element) return;
    element.removeEventListener("pointerdown", this.onPointerDown);
    element.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("keydown", this.onKeyDown);
    if (document.pointerLockElement === element) document.exitPointerLock();
    this.dragging = false;
    this.element = null;
  }

  get captured() {
    return this.element !== null && document.pointerLockElement === this.element;
  }

  onPointerDown = () => {
    this.dragging = true;
    // Capturing can be refused (for example right after Esc). Dragging still works then.
    if (!this.captured) this.element?.requestPointerLock().catch(() => {});
  };

  onPointerUp = () => {
    this.dragging = false;
  };

  onPointerMove = (event: PointerEvent) => {
    if (!this.captured && !this.dragging) return;
    this.yaw -= event.movementX * this.MOUSE_SENSITIVITY;
    this.pitch = THREE.MathUtils.clamp(
      this.pitch + event.movementY * this.MOUSE_SENSITIVITY,
      MIN_PITCH,
      MAX_PITCH,
    );
    this.recentering = false;
  };

  onWheel = (event: WheelEvent) => {
    // Also stops a trackpad pinch from zooming the whole page.
    event.preventDefault();
    const pixels = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * PIXELS_PER_WHEEL_LINE : event.deltaY;
    this.targetDistance = THREE.MathUtils.clamp(
      this.targetDistance + pixels * this.ZOOM_SENSITIVITY,
      MIN_DISTANCE,
      MAX_DISTANCE,
    );
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.code === RECENTER_KEY) this.recentering = true;
  };

  update(delta: number, camera: THREE.Camera, target: THREE.Object3D) {
    if (this.recentering) {
      // The character faces along its rotation.y, so "behind" is half a turn round.
      const turn = shortestAngleDelta(this.yaw, target.rotation.y + Math.PI);
      this.yaw = THREE.MathUtils.damp(this.yaw, this.yaw + turn, this.RECENTER_SPEED, delta);
      if (Math.abs(turn) < RECENTER_DONE) this.recentering = false;
    }
    this.distance = THREE.MathUtils.damp(this.distance, this.targetDistance, this.ZOOM_SMOOTHING, delta);

    this.focus.copy(target.position);
    this.focus.y += LOOK_HEIGHT;

    const horizontal = Math.cos(this.pitch) * this.distance;
    camera.position.set(
      this.focus.x + Math.sin(this.yaw) * horizontal,
      Math.max(this.focus.y + Math.sin(this.pitch) * this.distance, MIN_CAMERA_HEIGHT),
      this.focus.z + Math.cos(this.yaw) * horizontal,
    );
    camera.lookAt(this.focus);
  }
}
