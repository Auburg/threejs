import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './shaders/vertexShader.glsl?raw';
import fragmentShader from './shaders/fragmentShader.glsl?raw';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Add OrbitControls for mouse interaction
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);
controls.update();

// Create a flat white square
const squareShape = new THREE.Shape();
squareShape.moveTo(-0.5, -0.5);
squareShape.lineTo(0.5, -0.5);
squareShape.lineTo(0.5, 0.5);
squareShape.lineTo(-0.5, 0.5);
squareShape.lineTo(-0.5, -0.5);

const geometry = new THREE.ShapeGeometry(squareShape);

// Create shader material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0.0 }
  }
});

const squareMesh = new THREE.Mesh(geometry, material);
squareMesh.position.set(0, 0, 0);
scene.add(squareMesh);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

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

// Animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  // Update time uniform for shader animations
  material.uniforms.time.value = (Math.sin(Date.now() * 0.001) + 1.0) * 0.5;
  
  controls.update(); // Update controls for damping
  renderer.render(scene, camera);
}

animate();
