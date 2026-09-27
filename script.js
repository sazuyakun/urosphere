import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const unitVector = new THREE.Vector3();
const timer = new THREE.Timer();
const cameraOffset = new THREE.Vector3(0, 3, 5);

let model, actions, mixer;

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

function generateFloor() {
  const SIZE = 50;
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE);

  const material = new THREE.MeshBasicMaterial({
    color: 0x808080,
  });

  const floor = new THREE.Mesh(geometry, material);

  floor.rotation.x = -Math.PI / 2;
  return floor;
}

function onKeyPress() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        unitVector.z = -1;
        break;
      case "a":
      case "ArrowLeft":
        unitVector.x = -1;
        break;
      case "s":
      case "ArrowDown":
        unitVector.z = 1;
        break;
      case "d":
      case "ArrowRight":
        unitVector.x = 1;
        break;
    }
  });
  document.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        unitVector.z = 0;
        break;
      case "a":
      case "ArrowLeft":
        unitVector.x = 0;
        break;
      case "s":
      case "ArrowDown":
        unitVector.z = 0;
        break;
      case "d":
      case "ArrowRight":
        unitVector.x = 0;
        break;
    }
  });
}

function loadModel(camera) {
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

loadModel(camera);
onKeyPress();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
scene.add(generateFloor());

renderer.setAnimationLoop(() => {
  timer.update();
  const delta = timer.getDelta();

  if (model && actions) {
    const isMoving = !(unitVector.x === 0 && unitVector.z === 0);

    const direction = unitVector.clone().normalize();
    model.position.x += direction.x * delta;
    model.position.z += direction.z * delta;

    if (isMoving) {
      actions.idle.stop();
      actions.walk.play();
    } else {
      actions.walk.stop();
      actions.idle.play();
    }

    camera.position.copy(model.position).add(cameraOffset);
  }

  if (mixer) {
    mixer.update(delta);
  }

  renderer.render(scene, camera);
});
