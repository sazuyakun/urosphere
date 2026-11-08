import { PALETTE } from "./palette";
import { TOON_GRADIENT } from "./toonGradient";

// A flat stand-in for the island until the terrain step.
const GROUND_SIZE = 300;

export function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshToonMaterial color={PALETTE.grass} gradientMap={TOON_GRADIENT} />
    </mesh>
  );
}
