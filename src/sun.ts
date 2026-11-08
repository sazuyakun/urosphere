import * as THREE from "three";

// A low golden-afternoon sun, ahead and to the right of where the camera starts,
// so characters get a warm rim on one side. See docs/ART_DIRECTION.md section 4.
// Shared by the sunlight and the sky so the glow sits exactly where the light
// comes from. Treat it as read-only.
const SUN_ELEVATION = THREE.MathUtils.degToRad(25);
const SUN_AZIMUTH = THREE.MathUtils.degToRad(150);

export const SUN_DIRECTION = new THREE.Vector3().setFromSphericalCoords(
  1,
  Math.PI / 2 - SUN_ELEVATION,
  SUN_AZIMUTH,
);
