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
  whiteMatFloor
} from "/js/scene.js";

import {
  createDino
} from "/js/dino.js";

// Basic set up for the scene is based on the tutorial from Karim Maaloul
// https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
// + some other elements of the code from codepens
// https://codepen.io/Yakudoo

window.addEventListener("load", init, false);

let controls;
let stones;
let visibleClouds = [];
let invisibleClouds = [];
let visibleFloor = [];
let invisibleFloor = [];

const limitCloudLeft = -500;
const limitCloudRight = -limitCloudLeft;

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects
  fillFloor();
  createDino();
  createCactus();
  createStones();
  fillSky();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = true;
}

// Objects creation *****************************************************

function createCloud() {
  // Create an empty container that will hold the different parts of the cloud
  const cloud = new THREE.Object3D();

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
    cloud.add(c);
  }

  return cloud;
}

function getCloud() {
  if (invisibleClouds.length) {
    return invisibleClouds.pop();
  } else {
    return createCloud();
  }
}

function putCloudInSky(posX) {
  const cloud = getCloud();
  cloud.position.y = 20 + Math.random() * 100;
  cloud.position.x = posX || limitCloudRight;

  // for a better result, we position the clouds
  // at random depths inside of the scene
  cloud.position.z = -30 - Math.random() * 200;

  // we also set a random scale for each cloud
  const s = 1 + Math.random();
  cloud.scale.set(s, s, s);

  visibleClouds.push(cloud);
  // do not forget to add the mesh of each cloud in the scene
  scene.add(cloud);
}

function fillSky() {
  for (let i = 0; i < 10; i++) {
    // second value needs to be the double of second one
    // - a => limit of x to the left
    // + a => reset to 0
    // + a => same limit as the left one, but to the right
    const posX = limitCloudLeft + Math.random() * (limitCloudRight * 2);
    putCloudInSky(posX)
  }
}

function updateCloud() {
  for (let i = 0; i < visibleClouds.length; i++) {
    const cloud = visibleClouds[i];
    const z = cloud.position.z;
    cloud.position.x -= 1;
    // check if the particle is out of the field of view
    if (cloud.position.x < limitCloudLeft) {
      scene.remove(cloud);
      // recycle the particle
      invisibleClouds.push(visibleClouds.splice(i, 1)[0]);
      i--;
    }
  }
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

  /*const branch3 = branch1.clone();
  branch3.rotation.set(0, Math.PI / 2, 0);
  cactus.add(branch3);*/

  const rotate = Math.random();

  if (rotate > 0.5) {
    cactus.rotation.set(0, Math.PI, 0);
  }

  cactus.traverse(e => {
    e.castShadow = true;
    e.receiveShadow = true;
  });

  scene.add(cactus);
}

function createFloor() {
  // example on how to distort a plane
  // https://jsfiddle.net/h4oytk1a/1/


  // size, number of segments
  const geomFloor = new THREE.PlaneBufferGeometry(400, 400, 10, 10);

  //  1 //   0,   1,   2,   3,   4,   5,   6,   7,   8,   9,   10
  //  2 //  11,  12,  13,  14,  15,  16,  17,  18,  19,  20,  21
  //  3 //  22,  23,  24,  25,  26,  27,  28,  29,  30,  31,  32
  //  4 //  33,  34,  35,  36,  37,  38,  39,  40,  41,  42,  43
  //  5 //  44,  45,  46,  47,  48,  49,  50,  51,  52,  53,  54
  //  6 //  55,  56,  57,  58,  59,  60,  61,  62,  63,  64,  65
  //  7 //  66,  67,  68,  69,  70,  71,  72,  73,  74,  75,  76
  //  8 //  77,  78,  79,  80,  81,  82,  83,  84,  85,  86,  87
  //  9 //  88,  89,  90,  91,  92,  93,  94,  95,  96,  97,  98
  // 10 //  99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
  // 11 // 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120

  // plane 11 x 11 = 2 sides 11 values necessary

  let arrX = [];
  let arrY = [];
  let arrZ = [];

  for (let i = 0; i < 11; i++) {
    if (i >= 5 && i <= 7) {
      // modify data
      arrX.push(Math.ceil(Math.random() * 20));
      // the plane is rotated => y = z
      arrY.push(Math.ceil(Math.random() * 20));
      // the plane is rotated => z = y
      // should not put a value too big
      // otherwise, the feet of the Dino will look weird
      arrZ.push(Math.ceil(Math.random() * 4));
    } else {
      arrX.push(Math.ceil(Math.random() * 20));
      arrY.push(Math.ceil(Math.random() * 20));
      arrZ.push(Math.ceil(Math.random() * 20));
    }
  }

  const posAttribute = geomFloor.attributes.position;
  let count = 0;

  for (let i = 0; i < posAttribute.count; i++) {
    // access single vertex (x,y,z)
    let x = posAttribute.getX(i);
    let y = posAttribute.getY(i);
    let z = posAttribute.getZ(i);

    // left side => multiple of 11 (width)
    // right side => multiple of 11 when substracts-10
    // need to use the same values for the left side and the right
    // since we want to reuse the same ground various time
    // otherwise, the connection at the border can not be seamless

    // can only call the function createFloor once
    // otherwise, the valueswill be generated again
    // (except if we put them outside the function)
    if (i % 11 === 0) {
      x += arrX[count];
      y += arrY[count];
      z += arrZ[count];
    } else if ((i - 10) % 11 === 0) {
      x += arrX[count];
      y += arrY[count];
      z += arrZ[count];
      count++;
    }
    // middle is 6 => leave margin => 5, 6, 7
    // between 44 and 76
    else if (i >= 44 && i <= 76) {
      // modify data
      x += Math.random() * 20;
      // the plane is rotated => y = z
      y += Math.random() * 20;
      // the plane is rotated => z = y
      // should not put a value too big
      // otherwise, the feet of the Dino will look weird
      z += Math.random() * 4;
    } else {
      x += Math.random() * 20;
      // the plane is rotated => y = z
      y += Math.random() * 20;
      // the plane is rotated => z = y
      // Don't need to put a small value
      // is not in the way of the Dino
      z += Math.random() * 20;
    }
    // write data back to attribute
    posAttribute.setXYZ(i, x, y, z);
  }

  const floor = new THREE.Mesh(geomFloor, whiteMatFloor);
  floor.receiveShadow = true;
  return floor;
}

function getFloor() {
  if (invisibleFloor.length) {
    return invisibleFloor.pop();
  } else {
    return createFloor();
  }
}

function putFloorInScene(posX = 600) {
  let floor;
  if (visibleFloor.length === 0) {
    floor = getFloor();
  } else {
    floor = visibleFloor[0].clone();
  }
  floor.position.x = posX;
  floor.position.y = -45;
  floor.rotation.x = -Math.PI / 2;
  visibleFloor.push(floor);
  scene.add(floor);
}

function fillFloor() {
  let posX = -400;
  for (let i = 0; i < 3; i++) {
    putFloorInScene(posX);
    posX += 400;
  }
}

function Stones() {
  this.mesh = new THREE.Object3D();

  const stoneScale = 20;
  let stoneGeom = new THREE.BoxGeometry(stoneScale, stoneScale, stoneScale);

  for (let i = 0; i < 10; i++) {
    let mat = Math.random();

    if (mat < 0.7) {
      mat = yellowMat;
    } else {
      mat = greenMat;
    }

    // create the mesh by cloning the geometry
    let stone = new THREE.Mesh(stoneGeom, mat);

    const s = 0.2 + Math.random() * 0.6;
    // put the cloud down half the size of the main block
    // and up half the size of the random sized block
    // blocks are therefore aligned on the bottom instead of centered

    // set the position of each cube randomly
    stone.position.x = -120 + Math.random() * 240;
    // we want the small stones to go up and the big ones to be down
    // => the bigger s is, the smaller the y position should be
    stone.position.y = 5 - s * 5;

    // Need to leave a bigger margin than 24 for the dino
    // from 12 to -12 + half of the width of the stone
    // => Need to divide stones in 2 groups => those in front of the Dino
    // and those behind
    const zPos = Math.random();
    if (zPos < 0.7) {
      // 12 => touches the dino, so choose a higher value
      stone.position.z = -15 - (stoneScale * s) / 2 - Math.random() * 120;
    } else {
      stone.position.z = 15 + (stoneScale * s) / 2 + Math.random() * 120;
    }
    // set the size of the cube randomly
    stone.scale.set(s, s, s);

    // allow each cube to cast and to receive shadows
    stone.castShadow = true;
    stone.receiveShadow = true;

    // add the cube to the container we first created
    this.mesh.add(stone);
  }
}

function createStones() {
  stones = new Stones();
  stones.mesh.position.y = -47;
  scene.add(stones.mesh);
}

function loop() {
  // controls.update();

  //updateCloud();

  // render the scene
  renderer.render(scene, camera);
  // call the loop function again
  requestAnimationFrame(loop);
}

/*setInterval(() => {
  if (visibleClouds.length < 10) {
    putCloudInSky();
  }
}, 1000);*/