import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

const timer = new THREE.Timer();
const CAMERA_OFFSET = new THREE.Vector3(0, 3, 5);
const ROTATION_SPEED = 6;
const MOVEMENT_SPEED = 6;

let model, actions, mixer;

const state = {
  position: new THREE.Vector3(),
  moving: false,
  sprinting: false,
  angle: Math.PI,
  action: null,
  direction: new THREE.Vector3(),
};

// Function declaration
function basicSetup() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.copy(CAMERA_OFFSET);
  camera.lookAt(0, 0, 0);


  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2

  return { scene, camera, renderer, controls };
}

function helpers(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(axesHelper);
  scene.add(gridHelper);
}

function onKeyPress() {
  document.addEventListener("keydown", function(event) {
    console.log(event.code)
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        state.direction.z = -1;
        break;
      case "KeyA":
      case "ArrowLeft":
        state.direction.x = -1;
        break;
      case "KeyS":
      case "ArrowDown":
        state.direction.z = 1;
        break;
      case "KeyD":
      case "ArrowRight":
        state.direction.x = 1;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        state.sprinting = true;
        break;
    }
  });
  document.addEventListener("keyup", function(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        state.direction.z = 0;
        break;
      case "KeyA":
      case "ArrowLeft":
        state.direction.x = 0;
        break;
      case "KeyS":
      case "ArrowDown":
        state.direction.z = 0;
        break;
      case "KeyD":
      case "ArrowRight":
        state.direction.x = 0;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        state.sprinting = false;
        break;
    }
  });
}

function loadModel(scene) {
  const FILE_PATH = "/character-e.glb";

  const loader = new GLTFLoader();

  loader.load(FILE_PATH, (gltf) => {
    const gltfJson = gltf.parser.json;
    console.log(gltfJson);

    model = gltf.scene;
    scene.add(model);

    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer(model);

    actions = {
      idle: mixer.clipAction(animations[1]),
      walk: mixer.clipAction(animations[2]),
      sprint: mixer.clipAction(animations[3]),
    };
  });
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
const { scene, camera, renderer, controls } = basicSetup();

helpers(scene);
loadModel(scene);
onKeyPress();

renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();

  if (model && actions) {
    state.position = model.position.clone();

    const direction = state.direction.clone().normalize();
    direction.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      controls.getAzimuthalAngle()
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

    if (state.sprinting) {
      model.position.x += direction.x * 2 * MOVEMENT_SPEED * delta;
      model.position.z += direction.z * 2 * MOVEMENT_SPEED * delta;
    } else {
      model.position.x += direction.x * MOVEMENT_SPEED * delta;
      model.position.z += direction.z * MOVEMENT_SPEED * delta;
    }

    state.moving = !(state.direction.x === 0 && state.direction.z === 0);

    if (state.moving) {
      if (state.sprinting) {
        playAction("sprint");
      } else {
        playAction("walk");
      }
    } else {
      playAction("idle");
    }

    const positionMovedBy = model.position.clone().sub(state.position)
    camera.position.add(positionMovedBy);
    controls.target.add(positionMovedBy);
  }


  if (mixer) {
    mixer.update(delta);
  }

  controls.update()

  renderer.render(scene, camera);
});
