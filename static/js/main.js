import * as THREE from "/js/three.js/three.module.js";

// There's more than one version of OrbitControls
// need to make sure to use the module one
// to be able to import it this way (same for THREE.js)
import {
  OrbitControls
} from "/js/three.js/OrbitControls.js";

import {
  createScene,
  scene,
  camera,
  renderer,
  redMat,
  whiteMat,
  blueMat
} from "/js/scene.js";

import {
  createDino
} from "/js/dino.js";

// Basic set up for the scene is based on the tutorial from Karim Maaloul
// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/

window.addEventListener("load", init, false);

let controls;
let shadowLight;
let sky;

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects
  createSky();
  createFloor();
  //createDino();
  createCactus();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = true;
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

// Objects creation *****************************************************

// example on how to distort a plane
// https://jsfiddle.net/h4oytk1a/1/

function createFloor() {
  // size, number of segments
  const geomFloor = new THREE.PlaneBufferGeometry(300, 300, 10, 10);

  const posAttribute = geomFloor.attributes.position;

  for (let i = 0; i < posAttribute.count; i++) {
    // access single vertex (x,y,z)
    let x = posAttribute.getX(i);
    let y = posAttribute.getY(i);
    let z = posAttribute.getZ(i);

    // modify data (in this case just the z coordinate)
    x += Math.random() * 10;
    // the plane is rotated => y = z
    y += Math.random() * 10;
    // the plane is rotated => z = y
    z += Math.random() * 4;

    // write data back to attribute
    posAttribute.setXYZ(i, x, y, z);
  }
  const floor = new THREE.Mesh(geomFloor, whiteMat);
  scene.add(floor);

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -45;
  floor.receiveShadow = true;
  scene.add(floor);
}

function Cloud() {
  // Create an empty container that will hold the different parts of the cloud
  this.mesh = new THREE.Object3D();

  // create a cube geometry;
  // this shape will be duplicated to create the cloud
  const cloudScale = 20;

  let geomCloud = new THREE.BoxGeometry(cloudScale, cloudScale, cloudScale);

  for (let i = 0; i < 3; i++) {
    // create the mesh by cloning the geometry
    let c = new THREE.Mesh(geomCloud, whiteMat);

    const randomScale = 0.4 + Math.random() * 0.4;
    // put the cloud down half the size of the main block
    // and up half the size of the random sized block
    // blocks are therefore aligned on the bottom instead of centered
    const randomY = -cloudScale / 2 + (randomScale * cloudScale) / 2;

    // set the position and the rotation of each cube randomly
    c.position.x = i * 14;
    c.position.y = i === 1 ? 0 : randomY;
    //c.position.z = 0;
    c.position.z = -2.5 + Math.random() * 6;

    // set the size of the cube randomly
    var s = i === 1 ? 1 : randomScale;
    c.scale.set(s, s, s);

    // allow each cube to cast and to receive shadows
    c.castShadow = true;
    c.receiveShadow = true;

    // add the cube to the container we first created
    this.mesh.add(c);
  }
}

// Define a Sky Object
function Sky() {
  // Create an empty container
  this.mesh = new THREE.Object3D();

  // create the clouds
  for (let i = 0; i < 5; i++) {
    let c = new Cloud();

    c.mesh.position.y = 20 + Math.random() * 100;
    c.mesh.position.x = -100 + Math.random() * 500;

    // for a better result, we position the clouds
    // at random depths inside of the scene
    c.mesh.position.z = -50 - Math.random() * 500;

    // we also set a random scale for each cloud
    const s = 1 + Math.random();
    c.mesh.scale.set(s, s, s);

    // do not forget to add the mesh of each cloud in the scene
    this.mesh.add(c.mesh);
  }
}

function createSky() {
  sky = new Sky();
  scene.add(sky.mesh);
}

function createCactus() {
  const thickness = 17 - Math.ceil(Math.random() * 7);
  const height = 90 + Math.ceil(Math.random() * 20);

  const cactusGeom = new THREE.BoxGeometry(thickness, height, thickness);
  const cactus = new THREE.Mesh(cactusGeom, blueMat);

  const thickness1 = thickness - 2 - Math.ceil(Math.random() * 3);
  const length1 = 15 + Math.ceil(Math.random() * 5);
  // substract half of the parent and half of the child to align on the border
  const branch1X = -thickness / 2 - length1 / 2;
  const branch1Y = -10 + Math.ceil(Math.random() * 35);

  const branch1Geom = new THREE.BoxGeometry(length1, thickness1, thickness1);
  const branch1 = new THREE.Mesh(branch1Geom, blueMat);
  branch1.position.set(branch1X, branch1Y, 0);
  cactus.add(branch1);

  const height1S = 15 + Math.ceil(Math.random() * 5);
  const branch1SX = -(length1 - thickness1) / 2;
  const branch1SY = (height1S - thickness1) / 2;

  const branch1SGeom = new THREE.BoxGeometry(thickness1, height1S, thickness1);
  const branch1S = new THREE.Mesh(branch1SGeom, blueMat);
  branch1S.position.set(branch1SX, branch1SY, 0);
  branch1.add(branch1S);

  const twoBranches = Math.random();

  if (twoBranches > 0.3) {
    const branch2Y = Math.ceil(Math.random() * 30);

    const branch2 = branch1.clone();
    branch2.rotation.set(0, Math.PI, 0);


    const s = 0.5 + Math.random() * 0.5;
    branch2.scale.set(s, s, s);

    const branch2X = (thickness1 * s + length1 * s) / 2;

    branch2.position.set(branch2X, branch2Y, 0);
    cactus.add(branch2);
  }
  const rotate = Math.random();

  if (rotate > 0.5) {
    cactus.rotation.set(0, Math.PI, 0);
  }

  scene.add(cactus);
}

function loop() {
  // controls.update();

  // render the scene
  renderer.render(scene, camera);
  // call the loop function again
  requestAnimationFrame(loop);
}