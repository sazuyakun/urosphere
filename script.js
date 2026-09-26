import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

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

const { scene, camera, renderer } = basicSetup();

const loader = new GLTFLoader();

function loadModel(gltf) {
  const gltfJson = gltf.parser.json;
  console.log(gltfJson);
  const model = gltf.scene;
  model.add(camera);
  scene.add(model);
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        model.position.z -= 0.1;
        break;
      case "a":
      case "ArrowLeft":
        model.position.x -= 0.1;
        break;
      case "s":
      case "ArrowDown":
        model.position.z += 0.1;
        break;
      case "d":
      case "ArrowRight":
        model.position.x += 0.1;
        break;
    }
  });
}

loader.load(
  "/character-e.glb",
  (gltf) => loadModel(gltf),
  undefined,
  function (error) {
    console.error(error);
  },
);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
scene.add(generateFloor());

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
