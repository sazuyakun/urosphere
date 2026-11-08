import * as THREE from "three";
import { PALETTE } from "./palette";

// A low golden-afternoon sun, ahead and to the right of where the camera starts,
// so characters get a warm rim on one side. See docs/ART_DIRECTION.md section 4.
const SUN_ELEVATION = THREE.MathUtils.degToRad(25);
const SUN_AZIMUTH = THREE.MathUtils.degToRad(150);
const SUN_DISTANCE = 50;
const SUN_POSITION = new THREE.Vector3()
  .setFromSphericalCoords(SUN_DISTANCE, Math.PI / 2 - SUN_ELEVATION, SUN_AZIMUTH)
  .toArray();

// three.js divides diffuse light by pi. These are tuned so a sunlit upward
// surface ends up about 1.15/1.05/0.96 times its own colour: brighter than its
// base colour and slightly warm.
//
// The sky light is a flat ambient light, not a hemisphere light. A hemisphere
// light shades smoothly by surface direction, which blurs the two cel tones
// into a gradient. Flat ambient keeps every shadow one even, sky-tinted colour.
const SUN_INTENSITY = 3.1;
const SKY_INTENSITY = 1.65;

export function Lighting() {
  return (
    <>
      <directionalLight color={PALETTE.sunlight} intensity={SUN_INTENSITY} position={SUN_POSITION} />
      <ambientLight color={PALETTE.skyTop} intensity={SKY_INTENSITY} />
    </>
  );
}
