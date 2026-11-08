import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { ThirdPersonCamera } from "./ThirdPersonCamera";

// One third-person camera rig, listening to the canvas only while mounted.
export function useThirdPersonCamera() {
  const domElement = useThree((state) => state.gl.domElement);
  const [rig] = useState(() => new ThirdPersonCamera());

  useEffect(() => {
    rig.connect(domElement);
    return () => rig.disconnect();
  }, [rig, domElement]);

  return rig;
}
