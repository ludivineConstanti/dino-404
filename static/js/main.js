import * as THREE from "/js/three.js/three.module.js";

// There's more than one version of OrbitControls
// need to make sure to use the module one
// to be able to import it this way (same for THREE.js)
import {
  OrbitControls
} from "/js/three.js/OrbitControls.js";

import {
  createScene,
  createLights,
  scene,
  camera,
  renderer,
  blueMat,
  greenMat,
  yellowMat,
  whiteMat,
} from "/js/scene.js";

import {
  createDino,
  dino,
  jumpDuration,
  landed
} from "/js/objects/dino.js";

import {
  fillFloor,
  updateFloor,
  visibleFloor,
  invisibleFloor,
  putFloorInScene,
} from "/js/objects/floor.js";

import {
  fillSky,
  updateCloud,
  visibleClouds,
  putCloudInSky,
  invisibleClouds,
  limitCloudLeft,
  limitCloudRight,
} from "/js/objects/clouds.js";

let tailRotation = 1.3;
let dinoSpeed = 0;
let isJumping = false;
let isLanding = false;

// Basic set up for the scene is based on the tutorial from Karim Maaloul
// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
// + some other elements of the code from codepens
// https://codepen.io/Yakudoo

window.addEventListener("load", init, false);

let controls;
let visibleCactus = [];
let invisibleCactus = [];

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects
  fillFloor();
  createDino();
  createCactus();
  fillSky();
  createCactusRow();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = true;
}

// Objects creation *****************************************************

function createCactus() {
  const thickness = 17 - Math.ceil(Math.random() * 7);
  const height = 90 + Math.ceil(Math.random() * 20);

  // Always use BufferGeometry instead of Geometry, it’s faster.
  // ref => https://discoverthreejs.com/tips-and-tricks/
  const cactusGeom = new THREE.BoxBufferGeometry(thickness, height, thickness);
  const cactus = new THREE.Mesh(cactusGeom, blueMat);

  const thickness1 = thickness - 2 - Math.ceil(Math.random() * 3);
  const length1 = 15 + Math.ceil(Math.random() * 5);
  // substract half of the parent and half of the child to align on the border
  const branch1X = -thickness / 2 - length1 / 2;
  const branch1Y = -10 + Math.ceil(Math.random() * 35);

  const branch1Geom = new THREE.BoxBufferGeometry(
    length1,
    thickness1,
    thickness1
  );
  const branch1 = new THREE.Mesh(branch1Geom, blueMat);
  branch1.position.set(branch1X, branch1Y, 0);
  cactus.add(branch1);

  const height1S = 15 + Math.ceil(Math.random() * 5);
  const branch1SX = -(length1 - thickness1) / 2;
  const branch1SY = (height1S - thickness1) / 2;

  const branch1SGeom = new THREE.BoxBufferGeometry(
    thickness1,
    height1S,
    thickness1
  );
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

  cactus.traverse((e) => {
    e.castShadow = true;
    e.receiveShadow = true;
  });

  return cactus;
}

function getCactus() {
  if (invisibleCactus.length) {
    return invisibleCactus.pop();
  } else {
    return createCactus();
  }
}

function createCactusRow() {
  const cactusRow = new THREE.Object3D();

  const cactusNum = 2 + Math.ceil(Math.random() * 3);
  let x = 0;
  for (let i = 0; i < cactusNum; i++) {
    const s = 0.3 + Math.random() / 2;
    const cactus = getCactus();

    cactus.position.x += x;
    cactus.position.y -= 20;
    cactus.position.z = -170;
    cactus.scale.set(s, s, s);
    x += 30 + Math.random() * 20;
    cactusRow.add(cactus);
  }

  scene.add(cactusRow);
}

let increment = 0.02;

function loop() {
  // controls.update();

  dinoSpeed += 0.3;

  updateCloud();
  updateFloor();

  // apply the method stocked in the Dino prototype
  // on the dino instance
  if (landed) {
    isLanding = false;
  }
  if (!isJumping && !isLanding) {
    dino.run();
  }
  if (isJumping) {
    dino.jump();
  }
  if (jumpDuration > 10 && !landed) {
    isJumping = false;
    isLanding = true;
    dino.land();
  }
  window.addEventListener('keydown', e => {
    if (e.key === "ArrowUp") {
      isJumping = true;
    }
  });
  // render the scene
  renderer.render(scene, camera);
  // call the loop function again
  requestAnimationFrame(loop);
}

export {
  tailRotation,
  dinoSpeed
};