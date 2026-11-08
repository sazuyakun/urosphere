import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Input } from "./Input";
import { World } from "./World";
import { Character } from "./Character";
import { PerfStats } from "./PerfStats";

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = new Input();
    input.connect();
    const world = new World(containerRef.current!);
    const stats = import.meta.env.DEV ? new PerfStats(containerRef.current!, world.renderer) : null;
    const timer = new THREE.Timer();
    let disposed = false;

    Character.load(world.scene, "/character-e.glb").then((character) => {
      if (disposed) return;

      world.renderer.setAnimationLoop(() => {
        stats?.begin();
        timer.update();
        const delta = timer.getDelta();

        const movedBy = character.update(delta, input, world.controls.getAzimuthalAngle());
        world.follow(movedBy);

        world.render();
        stats?.end();
      });
    });

    return () => {
      disposed = true;
      stats?.dispose();
      input.disconnect();
      world.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
}
