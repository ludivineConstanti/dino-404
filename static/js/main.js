import * as THREE from "/js/three.js/three.module.js";

// There's more than one version of OrbitControls
// need to make sure to use the module one
// to be able to import it this way (same for THREE.js)
import {
  OrbitControls
} from "/js/three.js/OrbitControls.js";

// Basic set up for the scene is based on the tutorial from Karim Maaloul
// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

const Colors = {
  red: new THREE.Color(0xef4239),
  blue: new THREE.Color(0x4284f7),
  green: new THREE.Color(0x31ab52),
  yellow: new THREE.Color(0xffbd08),
  white: new THREE.Color(0xffffff),
};

// Give more accurate colors
Colors.red.convertSRGBToLinear();
Colors.white.convertSRGBToLinear();

window.addEventListener("load", init, false);

let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  container;
let controls;
let shadowLight;
let dino;

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects
  createObjects();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = true;
}

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 10;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 0;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant
    // (better to not use it for high poly complex projects)
    antialias: true,
  });

  // Change the colors => suppose to make it more accurate
  renderer.gammaFactor = 2.2;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Make the lights accurate
  // Default is false for backward compatibility
  // Useful mainly when we want to re-use real life light settings
  // Can potentially be a problem if there's no environment 
  // (real life gets a lot of reflected light from environments, not only light sources)
  // => Need indirect lighting
  // Ambient light is three.js solution to fake indirect lighting (too much calculations, otherwise)
  // Need to adjust the lights to use it (currently is too dark)
  // ref: https://discoverthreejs.com/book/first-steps/physically-based-rendering/
  // renderer.physicallyCorrectLights = true;

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
  // update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  // Directional lights (like all direct lights) are slow, should not use too many
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  // Set the direction of the light;
  shadowLight.position.set(-150, 100, 250);

  // Allow shadow casting
  // Shadows are expensive, therefore, there's no need to allow it for every light
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 1024;
  shadowLight.shadow.mapSize.height = 1024;

  // put light everywhere
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  // to activate the lights, just add them to the scene
  scene.add(shadowLight);
}

// Materials
// The Mesh Phong Material can reflect the light, unlike the Mesh Lambert material
// It's less accurate than Mesh Standard Material or Mesh Physical Material
// but performance will be better
const redMat = new THREE.MeshPhongMaterial({
  color: Colors.red,
  shading: THREE.FlatShading,
});

const whiteMat = new THREE.MeshPhongMaterial({
  color: Colors.white,
  shading: THREE.FlatShading,
});

// change from default shininess 30
redMat.shininess = 50;
whiteMat.shininess = 50;

// First let's define an object :
function Dino() {
  this.mesh = new THREE.Object3D();

  // 1:X 2:Y 3:Z
  const headGeom = new THREE.BoxGeometry(30, 20, 20);
  // To create an object in Three.js, we have to create a mesh
  // which is a combination of a geometry and some material
  const head = new THREE.Mesh(headGeom, redMat);
  head.castShadow = true;
  head.receiveShadow = true;
  this.mesh.add(head);

  const eyeGeom = new THREE.BoxGeometry(5, 5, 5);
  const eyeR = new THREE.Mesh(eyeGeom, whiteMat);
  const eyeL = eyeR.clone();
  // 1:X 2:Y 3:Z
  // X => negative values to the left, positive values to the right
  // the added cube is by default in the middle
  eyeR.position.set(-7.5, 2.5, 9);
  eyeL.position.set(-7.5, 2.5, -9);
  head.add(eyeR);
  head.add(eyeL);

  const mouthGeom = new THREE.BoxGeometry(14, 3, 14);

  // Need to make reference to the geometry, to modify its vertices, not to the final result
  // Right side
  mouthGeom.vertices[2].z -= 3;
  mouthGeom.vertices[7].z -= 3;
  // Left side
  mouthGeom.vertices[3].z += 3;
  mouthGeom.vertices[6].z += 3;
  // Front
  mouthGeom.vertices[2].x -= 3;
  mouthGeom.vertices[3].x -= 3;

  const mouth = new THREE.Mesh(mouthGeom, redMat);
  // Y => negative values to the bottom, positive values to the top
  mouth.position.set(0, -11.5, 0);
  head.add(mouth);

  // radius top, radius bottom, height, number of faces on the side, number of faces vertically
  const bodyGeom = new THREE.CylinderGeometry(7, 7, 28, 6, 2);

  // TOP
  // Front right
  bodyGeom.vertices[1].z -= 1;
  // Front left
  bodyGeom.vertices[2].z += 1;
  // Back right
  bodyGeom.vertices[5].z -= 0.5;
  // Back left
  bodyGeom.vertices[4].z += 0.5;
  // Front (first 4 vertices)
  bodyGeom.vertices[0].x -= 2;
  bodyGeom.vertices[1].x -= 2;
  bodyGeom.vertices[2].x -= 2;
  bodyGeom.vertices[3].x -= 2;

  //MIDDLE
  // Front right
  bodyGeom.vertices[7].x += 6;
  bodyGeom.vertices[7].z += 2;
  bodyGeom.vertices[7].y -= 2;
  // Front left
  bodyGeom.vertices[8].x += 6;
  bodyGeom.vertices[8].z -= 2;
  bodyGeom.vertices[8].y -= 2;
  // Middle right
  bodyGeom.vertices[6].x += 2;
  bodyGeom.vertices[6].z += 4;
  bodyGeom.vertices[6].y -= 6;
  // Middle left
  bodyGeom.vertices[9].x += 2;
  bodyGeom.vertices[9].z -= 4;
  bodyGeom.vertices[9].y -= 6;
  // Back right
  bodyGeom.vertices[11].x -= 3;
  bodyGeom.vertices[11].z += 3.5;
  bodyGeom.vertices[11].y -= 2;
  // Back left
  bodyGeom.vertices[10].x -= 3;
  bodyGeom.vertices[10].z -= 3.5;
  bodyGeom.vertices[10].y -= 2;

  // BOTTOM

  // Front right
  bodyGeom.vertices[13].x += 2;
  bodyGeom.vertices[13].y += 3;
  // Front left
  bodyGeom.vertices[14].x += 2;
  bodyGeom.vertices[14].y += 3;
  // Middle right
  bodyGeom.vertices[12].z += 1;
  // Middle left
  bodyGeom.vertices[15].z -= 1;
  // Back right
  bodyGeom.vertices[17].x -= 2;
  bodyGeom.vertices[17].z += 2;
  bodyGeom.vertices[17].y += 4;
  // Back left
  bodyGeom.vertices[16].x -= 2;
  bodyGeom.vertices[16].z -= 2;
  bodyGeom.vertices[16].y += 4;

  const body = new THREE.Mesh(bodyGeom, redMat);
  body.position.set(-5, -24, 0);
  this.mesh.add(body);

  const armGeom = new THREE.BoxGeometry(7, 3, 3);
  const armR = new THREE.Mesh(armGeom, redMat);
  armR.position.set(1, 8, 9.5);
  body.add(armR);

  const handGeom = new THREE.BoxGeometry(3, 3, 3);
  const hand = new THREE.Mesh(handGeom, redMat);
  hand.position.set(2, -1.5, 0);
  armR.add(hand);

  const armL = armR.clone();
  armL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  body.add(armL);

  // width, height, depth, width segments, height segments
  const legGeom = new THREE.BoxGeometry(13, 14, 8, 1, 2);

  // TOP
  // Front right
  legGeom.vertices[0].x -= 4;
  legGeom.vertices[0].z -= 4;
  // Front left
  legGeom.vertices[1].x -= 4;

  // Back right
  legGeom.vertices[7].x += 2;
  legGeom.vertices[7].z -= 4;
  // Back left
  legGeom.vertices[6].x += 2;

  // BOTTOM
  // Front Right
  legGeom.vertices[4].x -= 6;
  legGeom.vertices[4].z -= 2;
  // Front Left
  legGeom.vertices[5].x -= 6;
  // Back Right
  legGeom.vertices[11].x += 2;
  legGeom.vertices[11].z -= 2;
  // Back Left
  legGeom.vertices[10].x += 2;

  const legR = new THREE.Mesh(legGeom, redMat);
  legR.position.set(0, -8, 10);
  body.add(legR);

  const footGeom = new THREE.BoxGeometry(10, 3.5, 5);
  const foot = new THREE.Mesh(footGeom, redMat);
  foot.position.set(0.5, -8.5, -1);
  legR.add(foot);

  const legL = legR.clone();
  legL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
  body.add(legL);

  const tailGeom = new THREE.BoxGeometry(13, 12, 12);
  const tail = new THREE.Mesh(tailGeom, redMat);

  // TOP
  // Front right
  tailGeom.vertices[0].x -= 1;
  tailGeom.vertices[0].y -= 3;
  tailGeom.vertices[0].z -= 2;
  // Front left
  tailGeom.vertices[1].x -= 1;
  tailGeom.vertices[1].y -= 3;
  tailGeom.vertices[1].z += 2;

  // Back right
  tailGeom.vertices[5].x += 4;
  tailGeom.vertices[5].z -= 2;
  // Back left
  tailGeom.vertices[4].x += 4;
  tailGeom.vertices[4].z += 2;

  //BOTTOM

  // Back right
  tailGeom.vertices[7].z -= 1;
  // Back left
  tailGeom.vertices[6].z += 1;

  //rotation -80

  tail.position.set(-12, -2.5, 0);
  // smaller number turns toward right
  // 180° = PI = 3.14... can use Math.PI
  tail.rotation.set(0, 0, 1.35);
  body.add(tail);
}

function createDino() {
  // name of the instance = new instance of the function
  // the variable of the instance needs to be declared somewhere in the global scope
  dino = new Dino();
  // Need to put name of the object (or of the "container") we want to render
  scene.add(dino.mesh);
}

function createObjects() {
  createDino();
}

function loop() {
  // controls.update();

  // render the scene
  renderer.render(scene, camera);
  // call the loop function again
  requestAnimationFrame(loop);
}