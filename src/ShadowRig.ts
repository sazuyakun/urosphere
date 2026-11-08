import * as THREE from "three";
import { SUN_DIRECTION } from "./sun";

// One shadow map covering a square around where the camera is looking, moved
// every frame. 2048 px over 60 m is about 3 cm per shadow pixel.
export const SHADOW_MAP_SIZE = 2048;
const SHADOW_HALF_EXTENT = 30;
const SHADOW_TEXEL = (SHADOW_HALF_EXTENT * 2) / SHADOW_MAP_SIZE;
// The camera sits about this far behind the player, so the point this far in
// front of the camera (on the ground) is roughly where the player stands.
const SHADOW_AHEAD = 5;
// How far back along the sun direction the light sits from the shadow centre.
// Anything taller than this above the ground won't cast a shadow.
const LIGHT_DISTANCE = 60;

// The shadow camera's axes. They never change because the sun never moves.
const UP = new THREE.Vector3(0, 1, 0);
const LIGHT_FORWARD = SUN_DIRECTION.clone().negate();
const LIGHT_RIGHT = new THREE.Vector3().crossVectors(LIGHT_FORWARD, UP).normalize();
const LIGHT_UP = new THREE.Vector3().crossVectors(LIGHT_RIGHT, LIGHT_FORWARD);

// Moves the sun and its shadow camera to follow the view, snapped to whole shadow
// pixels. Without snapping, shadow edges shimmer as the map slides under them.
export class ShadowRig {
  forward = new THREE.Vector3();
  center = new THREE.Vector3();

  configure(light: THREE.DirectionalLight) {
    const camera = light.shadow.camera;
    camera.left = -SHADOW_HALF_EXTENT;
    camera.right = SHADOW_HALF_EXTENT;
    camera.top = SHADOW_HALF_EXTENT;
    camera.bottom = -SHADOW_HALF_EXTENT;
    camera.near = 1;
    camera.far = LIGHT_DISTANCE * 2;
    camera.updateProjectionMatrix();
    light.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  }

  update(light: THREE.DirectionalLight, camera: THREE.Camera) {
    camera.getWorldDirection(this.forward);
    this.forward.y = 0;
    this.forward.normalize();
    this.center.copy(camera.position).addScaledVector(this.forward, SHADOW_AHEAD);
    this.center.y = 0;

    // Snap sideways and up-down (as the sun sees them) to the shadow pixel grid.
    const right = Math.round(this.center.dot(LIGHT_RIGHT) / SHADOW_TEXEL) * SHADOW_TEXEL;
    const up = Math.round(this.center.dot(LIGHT_UP) / SHADOW_TEXEL) * SHADOW_TEXEL;
    const depth = this.center.dot(LIGHT_FORWARD);
    this.center
      .copy(LIGHT_RIGHT)
      .multiplyScalar(right)
      .addScaledVector(LIGHT_UP, up)
      .addScaledVector(LIGHT_FORWARD, depth);

    light.target.position.copy(this.center);
    light.target.updateMatrixWorld();
    light.position.copy(this.center).addScaledVector(SUN_DIRECTION, LIGHT_DISTANCE);
  }
}
