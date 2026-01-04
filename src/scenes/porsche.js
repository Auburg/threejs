import * as THREE from 'three';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui'; 
import { colorGUIHelper } from '../utils/color_gui_helper.js';
import { degRadHelper } from '../utils/deg_rad_helper.js';

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
RectAreaLightUniformsLib.init();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Gray background so we know rendering works

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

const loader = new GLTFLoader();

loader.load('/assets/2023_porsche_911_gt3_rs_2.7_carrera_tribute_992.glb', function (gltf) { 
  scene.add(gltf.scene);

  gltf.scene.name = "porsche_911_gt3_rs";
  // Center the model and adjust its scale
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.scale.set(100, 100, 100);

}, undefined, function (error) {
  console.error('Error loading model:', error);
});


/* const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight); */

const color = 0xFFFFFF;
const intensity = 150;
const width = 12;
const height = 4;
const light = new THREE.RectAreaLight(color, intensity, width, height);
light.position.set(0, 10, 0);
light.rotation.x = THREE.MathUtils.degToRad(-90);
//light.target.position.set(0, 0, 0);
//scene.add(light);
scene.add(light);

const helper = new RectAreaLightHelper(light);
scene.add(helper);

/*function updateLight() {
  //light.target.updateMatrixWorld();
  helper.update();
}
 
updateLight();*/

const planeSize = 40;
  
const texloader = new THREE.TextureLoader();
const texture = texloader.load('images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

const gui = new GUI();
gui.addColor(new colorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 10, 0.01);
gui.add(light, 'width', 0, 20);
gui.add(light, 'height', 0, 20);
gui.add(new degRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
gui.add(new degRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
gui.add(new degRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');
 
makeXYZGUI(gui, light.position, 'position');

//makeXYZGUI(gui, light.position, 'position', updateLight);
//makeXYZGUI(gui, light.target.position, 'target', updateLight);

// Animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  
  if (scene.getObjectByName("porsche_911_gt3_rs")) {
    //scene.getObjectByName("porsche_911_gt3_rs").rotation.y += 0.005; // Slow rotation for better viewing
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