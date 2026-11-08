import { useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Character } from "./Character";
import { useInput } from "./useInput";
import { useOrbitControls } from "./useOrbitControls";

const MODEL_URL = "/character-e.glb";

// The local player: a keyboard-driven character with an orbit camera that follows it.
// Suspends until the model has loaded, so the frame loop never sees a missing model.
export function Player() {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const [character] = useState(() => new Character(gltf));
  const input = useInput();
  const controls = useOrbitControls();

  useFrame((state, delta) => {
    const movedBy = character.update(delta, input, controls.getAzimuthalAngle());
    // The camera follows by offset. It must never be parented to the model.
    state.camera.position.add(movedBy);
    controls.target.add(movedBy);
    controls.update();
  });

  return <primitive object={character.model} />;
}
