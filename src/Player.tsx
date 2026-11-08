import { useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Character } from "./Character";
import { useInput } from "./useInput";
import { useThirdPersonCamera } from "./useThirdPersonCamera";

const MODEL_URL = "/character-e.glb";

// The local player: a keyboard-driven character with a free orbit camera around it.
// Suspends until the model has loaded, so the frame loop never sees a missing model.
export function Player() {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const [character] = useState(() => new Character(gltf));
  const input = useInput();
  const cameraRig = useThirdPersonCamera();

  useFrame((state, delta) => {
    character.update(delta, input, cameraRig.yaw);
    // The camera is placed around the character every frame. It must never be
    // parented to the model, or it would turn with it.
    cameraRig.update(delta, state.camera, character.model);
  });

  return <primitive object={character.model} />;
}
