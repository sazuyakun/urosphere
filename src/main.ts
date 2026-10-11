import * as THREE from "three";
import { Input } from "./Input";
import { World } from "./World"
import { Character } from "./Character";

const input = new Input();
const world = new World();
const character = await Character.load(world.scene, "/character-e.glb")
const timer = new THREE.Timer();

world.renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();

  const movedBy = character.update(delta, input, world.controls.getAzimuthalAngle());
  world.follow(movedBy)

  world.render()

});
