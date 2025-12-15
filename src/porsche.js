import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Gray background so we know rendering works

// Add axes helper to see orientation
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
console.log('Axes helper added');

const loader = new GLTFLoader();

loader.load('/assets/2023_porsche_911_gt3_rs_2.7_carrera_tribute_992.glb', function (gltf) {
  console.log('Model loaded successfully');
  scene.add(gltf.scene);

  gltf.scene.name = "porsche_911_gt3_rs";

  // Center the model and adjust its scale
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.scale.set(100, 100, 100);

  // Log position and scale for debugging
  console.log('Model position:', gltf.scene.position);
  console.log('Model scale:', gltf.scene.scale);  

}, undefined, function (error) {
  console.error('Error loading model:', error);
});

// Add stronger lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(-10, 10, -10);
scene.add(light2);

// Animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  if (scene.getObjectByName("porsche_911_gt3_rs")) {
    scene.getObjectByName("porsche_911_gt3_rs").rotation.y += 0.005; // Slow rotation for better viewing
  }     
  renderer.render(scene, camera);
}

// Handle window resize
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

animate();