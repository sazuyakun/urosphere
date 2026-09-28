import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { Input } from "./Input";
import { World } from "./World"

const input = new Input();
const world = new World();
const timer = new THREE.Timer();
const ROTATION_SPEED = 6;
const MOVEMENT_SPEED = 6;


const state = {
  position: new THREE.Vector3(),
  angle: Math.PI,
  action: null,
};


async function loadModel(scene) {
  const FILE_PATH = "/character-e.glb";

  const loader = new GLTFLoader();
  let model, mixer;

  const gltf = await loader.loadAsync(FILE_PATH)
  const gltfJson = gltf.parser.json;
  console.log(gltfJson);

  model = gltf.scene;
  scene.add(model);

  const animations = gltf.animations;

  mixer = new THREE.AnimationMixer(model);

  const actions = {
    idle: mixer.clipAction(animations[1]),
    walk: mixer.clipAction(animations[2]),
    sprint: mixer.clipAction(animations[3]),
  };

  return { model, mixer, actions }
}

function playAction(action) {
  if (state.action === action) return;

  actions[state.action]?.fadeOut(0.2);

  const nextAction = actions[action];

  state.action = action;

  nextAction.reset();
  nextAction.fadeIn(0.2);
  nextAction.play();
}

function shortestAngleDelta(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}


// Main implementation
const { model, mixer, actions } = await loadModel(world.scene);


world.renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();

  state.position = model.position.clone();

  const direction = input.direction.clone().normalize();
  direction.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    world.controls.getAzimuthalAngle()
  )

  if (direction.x !== 0 || direction.z !== 0) {
    state.angle = Math.atan2(direction.x, direction.z);
  }

  const delta_ = shortestAngleDelta(model.rotation.y, state.angle);
  const targetRotation = model.rotation.y + delta_;

  model.rotation.y = THREE.MathUtils.damp(
    model.rotation.y,
    targetRotation,
    ROTATION_SPEED,
    delta,
  );

  if (input.sprinting) {
    model.position.x += direction.x * 2 * MOVEMENT_SPEED * delta;
    model.position.z += direction.z * 2 * MOVEMENT_SPEED * delta;
  } else {
    model.position.x += direction.x * MOVEMENT_SPEED * delta;
    model.position.z += direction.z * MOVEMENT_SPEED * delta;
  }


  if (input.moving) {
    if (input.sprinting) {
      playAction("sprint");
    } else {
      playAction("walk");
    }
  } else {
    playAction("idle");
  }

  const positionMovedBy = model.position.clone().sub(state.position)
  world.follow(positionMovedBy)

  // Animation update
  mixer.update(delta);

  world.render()

});
