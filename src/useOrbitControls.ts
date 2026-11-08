import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Orbit controls for the default camera. The caller calls controls.update() each
// frame after moving the target, so following and damping happen in one place.
export function useOrbitControls() {
  const camera = useThree((state) => state.camera);
  const domElement = useThree((state) => state.gl.domElement);

  const [controls] = useState(() => {
    // Created without a DOM element; listeners are attached in the effect so
    // StrictMode's mount, unmount, mount cycle leaves exactly one set.
    const controls = new OrbitControls(camera);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2;
    return controls;
  });

  useEffect(() => {
    controls.connect(domElement);
    return () => controls.disconnect();
  }, [controls, domElement]);

  return controls;
}
