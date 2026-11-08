import { useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { PALETTE } from "./palette";
import { ShadowRig } from "./ShadowRig";

// three.js divides diffuse light by pi. These are tuned (in linear colour) so:
// - a sunlit upward surface shows about 1.15/1.05/0.96 times its own colour:
//   a little brighter than its base colour, and slightly warm;
// - a shadowed surface, lit only by the fill, shows about 0.60/0.62/0.80 times
//   its colour: about 60% as bright and cool lavender, the anime shadow tint.
//
// The fill is a flat ambient light, not a hemisphere light. A hemisphere light
// shades smoothly by surface direction, which blurs the two cel tones into a
// gradient. Flat ambient keeps every shadow one even colour.
const SUN_INTENSITY = 1.73;
const FILL_INTENSITY = 2.51;

// The golden-hour sun with its shadow following the view, plus the shadow fill.
export function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null!);
  const [rig] = useState(() => new ShadowRig());

  useLayoutEffect(() => rig.configure(sun.current), [rig]);
  useFrame(({ camera }) => rig.update(sun.current, camera));

  return (
    <>
      <directionalLight ref={sun} color={PALETTE.sunlight} intensity={SUN_INTENSITY} castShadow />
      <ambientLight color={PALETTE.shadowFill} intensity={FILL_INTENSITY} />
    </>
  );
}
