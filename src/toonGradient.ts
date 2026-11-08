import * as THREE from "three";

// The cel-shading ramp every toon material shares. MeshToonMaterial looks this
// up by how directly a surface faces a light: the left half is shadow, the right
// half is lit. Linear filtering across the one step in the middle gives the
// narrow soft edge between the two tones (Haven's softness, not hard bands).
const SHADOW = 110;
const LIT = 255;
const RAMP = new Uint8Array([SHADOW, SHADOW, SHADOW, SHADOW, LIT, LIT, LIT, LIT]);

export const TOON_GRADIENT = new THREE.DataTexture(RAMP, RAMP.length, 1, THREE.RedFormat);
TOON_GRADIENT.minFilter = THREE.LinearFilter;
TOON_GRADIENT.magFilter = THREE.LinearFilter;
TOON_GRADIENT.generateMipmaps = false;
TOON_GRADIENT.needsUpdate = true;
