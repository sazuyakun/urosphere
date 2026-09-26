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

const { scene, camera, renderer } = basicSetup();

const loader = new GLTFLoader();

function loadModel(gltf) {
  const gltfJson = gltf.parser.json;
  console.log(gltfJson);
  const model = gltf.scene;
  scene.add(model);
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "w": // W
        camera.position.z -= 0.1;
        model.position.z -= 0.1;
        break;
      case "a": // A
        camera.position.x -= 0.1;
        model.position.x -= 0.1;
        break;
      case "s": // S
        camera.position.z += 0.1;
        model.position.z += 0.1;
        break;
      case "d": // D
        camera.position.x += 0.1;
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

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
