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
  camera.position.set(0, 2, 5);
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
  scene.add(gltf.scene);
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
