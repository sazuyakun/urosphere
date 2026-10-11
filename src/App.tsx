import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Input } from "./Input";
import { World } from "./World";
import { Character } from "./Character";

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = new Input();
    const world = new World(containerRef.current!);
    const timer = new THREE.Timer();
    let disposed = false;

    Character.load(world.scene, "/character-e.glb").then((character) => {
      if (disposed) return;

      world.renderer.setAnimationLoop(() => {
        timer.update();
        const delta = timer.getDelta();

        const movedBy = character.update(delta, input, world.controls.getAzimuthalAngle());
        world.follow(movedBy);

        world.render();
      });
    });

    return () => {
      disposed = true;
      input.dispose();
      world.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
}
