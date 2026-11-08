import { PALETTE } from "./palette";
import { SUN_DIRECTION } from "./sun";

// A directional light only uses its direction, so the distance just needs to be
// positive. It will matter once the shadow camera follows the player.
const SUN_DISTANCE = 50;
const SUN_POSITION = SUN_DIRECTION.clone().multiplyScalar(SUN_DISTANCE).toArray();

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
