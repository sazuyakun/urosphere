import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const unitVector = new THREE.Vector3();
const timer = new THREE.Timer();
const cameraOffset = new THREE.Vector3(0, 3, 5);

let model, actions, mixer, currentAction;
let currentAngle = Math.PI;
let isSprinting = false;
let SPEED = 6;

// Function declaration
function basicSetup() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 3, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

function helpers(scene) {
  const axesHelper = new THREE.AxesHelper(5);
  const gridHelper = new THREE.GridHelper(50, 50);
  scene.add(axesHelper);
  scene.add(gridHelper);
}

function onKeyPress() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "w":
      case "W":
      case "ArrowUp":
        unitVector.z = -1;
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        unitVector.x = -1;
        break;
      case "s":
      case "S":
      case "ArrowDown":
        unitVector.z = 1;
        break;
      case "d":
      case "D":
      case "ArrowRight":
        unitVector.x = 1;
        break;
      case "Shift":
        isSprinting = true;
        break;
    }
  });
  document.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "w":
      case "W":
      case "ArrowUp":
        unitVector.z = 0;
        break;
      case "a":
      case "A":
      case "ArrowLeft":
        unitVector.x = 0;
        break;
      case "s":
      case "S":
      case "ArrowDown":
        unitVector.z = 0;
        break;
      case "d":
      case "D":
      case "ArrowRight":
        unitVector.x = 0;
        break;
      case "Shift":
        isSprinting = false;
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

// Main implementation
const { scene, camera, renderer } = basicSetup();

helpers(scene);
loadModel(scene);
onKeyPress();

function playAction(action) {
  if (currentAction === action) return;

  currentAction?.fadeOut(0.2);

  currentAction = action;
  currentAction.reset();
  currentAction.fadeIn(0.2);
  currentAction.play();
}

renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();

  if (model && actions) {
    const direction = unitVector.clone().normalize();

    if (direction.x === 0 && direction.z === 0) {
      model.rotation.set(0, currentAngle, 0);
    } else {
      const angle = Math.atan2(direction.x, direction.z);
      model.rotation.set(0, angle, 0);
      currentAngle = angle;
    }

    if (isSprinting) {
      model.position.x += direction.x * 2 * SPEED * delta;
      model.position.z += direction.z * 2 * SPEED * delta;
    } else {
      model.position.x += direction.x * SPEED * delta;
      model.position.z += direction.z * SPEED * delta;
    }

    const isMoving = !(unitVector.x === 0 && unitVector.z === 0);

    if (isMoving) {
      if (isSprinting) {
        playAction(actions.sprint);
      } else {
        playAction(actions.walk);
      }
    } else {
      playAction(actions.idle);
    }

    camera.position.copy(model.position).add(cameraOffset);
  }

  if (mixer) {
    mixer.update(delta);
  }

  renderer.render(scene, camera);
});
