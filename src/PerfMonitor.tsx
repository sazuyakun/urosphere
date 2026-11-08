import { useEffect } from "react";
import { addAfterEffect, addEffect, useThree } from "@react-three/fiber";
import { PerfStats } from "./PerfStats";

// Dev-only. Times each whole frame: every useFrame callback plus the render.
export function PerfMonitor() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const stats = new PerfStats(gl.domElement.parentElement!, gl);
    const removeBegin = addEffect(() => stats.begin());
    const removeEnd = addAfterEffect(() => stats.end());
    return () => {
      removeBegin();
      removeEnd();
      stats.dispose();
    };
  }, [gl]);

  return null;
}
