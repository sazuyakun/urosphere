import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Player } from "./Player";
import { PerfMonitor } from "./PerfMonitor";
import { Lighting } from "./Lighting";
import { Ground } from "./Ground";
import { Sky, FOG_FAR } from "./Sky";

// Retina screens render at 1.5x instead of 2x: much sharper than 1x for about
// 60% of the GPU cost of 2x. Screens below this get MSAA instead, since their
// bigger pixels make jagged edges visible. See the measurements in docs/PLAN.md.
const MAX_PIXEL_RATIO = 1.5;

// Fog hides everything past FOG_FAR, so drawing further is wasted work.
const CAMERA_FAR = FOG_FAR + 50;

export function App() {
  return (
    <Canvas
      dpr={[1, MAX_PIXEL_RATIO]}
      // antialias can only be chosen when the renderer is created. alpha: false
      // keeps an opaque canvas (R3F defaults to transparent).
      gl={{ antialias: window.devicePixelRatio < MAX_PIXEL_RATIO, alpha: false }}
      // No tone mapping: cel art needs the exact palette colours on screen (R3F defaults to ACES).
      flat
      camera={{ fov: 75, near: 0.1, far: CAMERA_FAR, position: [0, 3, 5] }}
    >
      <Sky />
      <Lighting />
      <Ground />
      {/* Dev-only movement reference until shadows and props exist. Raised to avoid flickering with the ground. */}
      {import.meta.env.DEV && <gridHelper args={[50, 50]} position-y={0.01} />}
      <Suspense fallback={null}>
        <Player />
      </Suspense>
      {import.meta.env.DEV && <PerfMonitor />}
    </Canvas>
  );
}
