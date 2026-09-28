import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Character {
  static async load(scene, path) {
    const gltf = await new GLTFLoader().loadAsync(path)
    scene.add(gltf.scene)
    return new Character(gltf)
  }
  constructor(gltf) {
    this.ROTATION_SPEED = 6;
    this.MOVEMENT_SPEED = 6;
    this.model = gltf.scene
    this.position = new THREE.Vector3()
    this.action = null
    this.angle = Math.PI

    // this.gltfJson = gltf.parser.json;
    // console.log(this.gltfJson);

    this.animations = gltf.animations;

    this.mixer = new THREE.AnimationMixer(this.model);

    this.actions = {
      idle: this.mixer.clipAction(this.animations[1]),
      walk: this.mixer.clipAction(this.animations[2]),
      sprint: this.mixer.clipAction(this.animations[3]),
    };
  }

  playAction(action) {
    if (this.action === action) return;

    this.actions[this.action]?.fadeOut(0.2);

    const nextAction = this.actions[action];

    this.action = action;

    nextAction.reset();
    nextAction.fadeIn(0.2);
    nextAction.play();
  }

  shortestAngleDelta(from, to) {
    return Math.atan2(Math.sin(to - from), Math.cos(to - from));
  }

  update(delta, input, azimuthAngle) {
    this.position = this.model.position.clone();

    const direction = input.direction.clone().normalize()
    direction.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      azimuthAngle
    )


    if (direction.x !== 0 || direction.z !== 0) {
      this.angle = Math.atan2(direction.x, direction.z);
    }
    const delta_ = this.shortestAngleDelta(this.model.rotation.y, this.angle);
    const targetRotation = this.model.rotation.y + delta_;

    this.model.rotation.y = THREE.MathUtils.damp(
      this.model.rotation.y,
      targetRotation,
      this.ROTATION_SPEED,
      delta,
    );

    if (input.sprinting) {
      this.model.position.x += direction.x * 2 * this.MOVEMENT_SPEED * delta;
      this.model.position.z += direction.z * 2 * this.MOVEMENT_SPEED * delta;
    } else {
      this.model.position.x += direction.x * this.MOVEMENT_SPEED * delta;
      this.model.position.z += direction.z * this.MOVEMENT_SPEED * delta;
    }


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
    return this.model.position.clone().sub(this.position)
  }
}
