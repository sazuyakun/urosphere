import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Input } from "./Input";
import { shortestAngleDelta } from "./angles";

type ActionName = "idle" | "walk" | "sprint";

const UP = new THREE.Vector3(0, 1, 0);

export class Character {
  ROTATION_SPEED = 6;
  MOVEMENT_SPEED = 6;
  SPRINT_MULTIPLIER = 2;
  model: THREE.Group;
  // Scratch vectors reused every frame so update() allocates nothing.
  direction = new THREE.Vector3();
  movedBy = new THREE.Vector3();
  action: ActionName | null;
  angle: number;
  animations: THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
  actions: Record<ActionName, THREE.AnimationAction>;

  constructor(gltf: GLTF) {
    this.model = gltf.scene
    this.model.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) object.castShadow = true
    })
    this.action = null
    this.angle = Math.PI

    // this.gltfJson = gltf.parser.json;
    // console.log(this.gltfJson);

    this.animations = gltf.animations;

    this.mixer = new THREE.AnimationMixer(this.model);

    this.actions = {
      idle: this.mixer.clipAction(this.clip("idle")),
      walk: this.mixer.clipAction(this.clip("walk")),
      sprint: this.mixer.clipAction(this.clip("sprint")),
    };
  }

  clip(name: string) {
    const clip = THREE.AnimationClip.findByName(this.animations, name);
    if (!clip) throw new Error(`Animation "${name}" not found in model`);
    return clip;
  }

  playAction(action: ActionName) {
    if (this.action === action) return;

    if (this.action) this.actions[this.action].fadeOut(0.2);

    const nextAction = this.actions[action];

    this.action = action;

    nextAction.reset();
    nextAction.fadeIn(0.2);
    nextAction.play();
  }

  // Movement is relative to the camera: cameraYaw turns the input so W always
  // walks away from the camera.
  update(delta: number, input: Input, cameraYaw: number) {
    const direction = this.direction.copy(input.direction).normalize().applyAxisAngle(UP, cameraYaw);

    if (direction.x !== 0 || direction.z !== 0) {
      this.angle = Math.atan2(direction.x, direction.z);
    }
    const delta_ = shortestAngleDelta(this.model.rotation.y, this.angle);
    const targetRotation = this.model.rotation.y + delta_;

    this.model.rotation.y = THREE.MathUtils.damp(
      this.model.rotation.y,
      targetRotation,
      this.ROTATION_SPEED,
      delta,
    );

    const speed = input.sprinting ? this.MOVEMENT_SPEED * this.SPRINT_MULTIPLIER : this.MOVEMENT_SPEED;
    this.movedBy.copy(direction).multiplyScalar(speed * delta);
    this.model.position.add(this.movedBy);

    if (input.moving) {
      if (input.sprinting) {
        this.playAction("sprint");
      } else {
        this.playAction("walk");
      }
    } else {
      this.playAction("idle");
    }

    this.mixer.update(delta);
  }
}
