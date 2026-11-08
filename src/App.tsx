import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Player } from "./Player";
import { PerfMonitor } from "./PerfMonitor";

// Retina screens render at 1.5x instead of 2x: much sharper than 1x for about
// 60% of the GPU cost of 2x. Screens below this get MSAA instead, since their
// bigger pixels make jagged edges visible. See the measurements in docs/PLAN.md.
const MAX_PIXEL_RATIO = 1.5;

export function App() {
  return (
    <Canvas
      dpr={[1, MAX_PIXEL_RATIO]}
      // antialias can only be chosen when the renderer is created. alpha: false
      // keeps an opaque canvas (R3F defaults to transparent).
      gl={{ antialias: window.devicePixelRatio < MAX_PIXEL_RATIO, alpha: false }}
      // No tone mapping until we decide on colour in Phase 1 (R3F defaults to ACES).
      flat
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 3, 5] }}
    >
      <axesHelper args={[5]} />
      <gridHelper args={[50, 50]} />
      <Suspense fallback={null}>
        <Player />
      </Suspense>
      {import.meta.env.DEV && <PerfMonitor />}
    </Canvas>
  );
}
