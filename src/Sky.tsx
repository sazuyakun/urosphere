import * as THREE from "three";
import { PALETTE } from "./palette";
import { SUN_DIRECTION } from "./sun";

// Fog fades everything into the horizon colour, so the ground meets the sky with
// no visible edge. Nothing past FOG_FAR is visible, so the camera can stop there.
const FOG_NEAR = 60;
export const FOG_FAR = 250;

// How far up the sky (as the y of a view direction, 0 to 1) the warm horizon
// blends into the blue overhead.
const HORIZON_BLEND = 0.55;
// Higher is a tighter glow around the sun.
const SUN_GLOW_TIGHTNESS = 12;
const SUN_GLOW_STRENGTH = 0.6;
// A stylized sun disc, a few times bigger than the real one. These are cosines
// of the angle from the sun's centre: the disc's soft edge runs between them.
const SUN_DISC_OUTER = 0.9992;
const SUN_DISC_INNER = 0.9996;

const SKY_RENDER_ORDER = 1000;

const UNIFORMS = {
  uTop: { value: new THREE.Color(PALETTE.skyTop) },
  uHorizon: { value: new THREE.Color(PALETTE.skyHorizon) },
  uSunGlow: { value: new THREE.Color(PALETTE.sunGlow) },
  uSunDirection: { value: SUN_DIRECTION },
};

// Only the camera's rotation is applied, never its position, so the sky is
// infinitely far away. z = w puts it on the far plane, behind everything.
// It's drawn after all other solid objects (SKY_RENDER_ORDER), so the depth
// test skips every pixel the world already covers and only visible sky gets shaded.
const VERTEX_SHADER = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = position;
    vec4 clip = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
    gl_Position = clip.xyww;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uSunGlow;
  uniform vec3 uSunDirection;
  varying vec3 vDirection;

  void main() {
    vec3 direction = normalize(vDirection);
    vec3 color = mix(uHorizon, uTop, smoothstep(0.0, ${HORIZON_BLEND.toFixed(2)}, direction.y));

    float towardSun = max(dot(direction, uSunDirection), 0.0);
    color = mix(color, uSunGlow, pow(towardSun, ${SUN_GLOW_TIGHTNESS.toFixed(1)}) * ${SUN_GLOW_STRENGTH.toFixed(2)});
    color = mix(color, uSunGlow, smoothstep(${SUN_DISC_OUTER.toFixed(4)}, ${SUN_DISC_INNER.toFixed(4)}, towardSun));

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

// The gradient sky dome plus distance fog in the matching horizon colour.
export function Sky() {
  return (
    <>
      <fog attach="fog" args={[PALETTE.skyHorizon, FOG_NEAR, FOG_FAR]} />
      <mesh renderOrder={SKY_RENDER_ORDER} frustumCulled={false}>
        <sphereGeometry args={[1, 32, 16]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={UNIFORMS}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
        />
      </mesh>
    </>
  );
}
