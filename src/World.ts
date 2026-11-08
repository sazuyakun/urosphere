import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Retina screens render at 1.5x instead of 2x: much sharper than 1x for about
// 60% of the GPU cost of 2x. Screens below this get MSAA instead, since their
// bigger pixels make jagged edges visible. See the measurements in docs/PLAN.md.
const MAX_PIXEL_RATIO = 1.5;

function pixelRatio() {
  return Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
}

export class World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  constructor(container: HTMLElement) {
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

    // antialias can only be chosen when the renderer is created.
    this.renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < MAX_PIXEL_RATIO });
    this.renderer.setPixelRatio(pixelRatio());
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI / 2

    this.scene.add(new THREE.AxesHelper(5), new THREE.GridHelper(50, 50))

    window.addEventListener("resize", this.onResize)
  }

  onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    // Pixel ratio changes when the window moves between a retina and a normal screen.
    this.renderer.setPixelRatio(pixelRatio());
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  follow(delta: THREE.Vector3) {
    this.camera.position.add(delta);
    this.controls.target.add(delta);
  }

  render() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
    this.renderer.setAnimationLoop(null);
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
