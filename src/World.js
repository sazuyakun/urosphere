import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class World {
  constructor() {
    this.scene = new THREE.Scene();

    const CAMERA_OFFSET = new THREE.Vector3(0, 3, 5);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.copy(CAMERA_OFFSET);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI / 2

    this.scene.add(new THREE.AxesHelper(5), new THREE.GridHelper(50, 50))
  }

  follow(delta) {
    this.camera.position.add(delta);
    this.controls.target.add(delta);
  }

  render() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }
}
