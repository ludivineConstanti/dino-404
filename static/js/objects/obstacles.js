import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    redMat,
    blueMat,
    yellowMat,
    greenMat,
    whiteMat,
} from "/js/scene.js";

let cactusArr = [];
let sCactusArr = [];
let visibleObst = [];
let visibleSObst = [];
let invisibleObst = [];
let invisibleSObst = [];
const limitLeft = -400;
const limitRight = -limitLeft;

function fillcactusArr() {

    // 1st cactus ******************************************************
    const wholeCactus1 = new THREE.Object3D();
    // radius top, radius bottom, height, radial segments, height segments
    const cactusGeom = new THREE.CylinderGeometry(10, 10, 30, 6, 2);
    const cSNewWidth = 7;
    const cSY = 6;

    //front right
    cactusGeom.vertices[7].x += cSNewWidth * 0.85;
    cactusGeom.vertices[7].z += cSNewWidth * 0.5;
    cactusGeom.vertices[7].y += cSY;
    // front left
    cactusGeom.vertices[8].x += cSNewWidth * 0.85;
    cactusGeom.vertices[8].z -= cSNewWidth * 0.5;
    cactusGeom.vertices[8].y += cSY;
    // middle right
    cactusGeom.vertices[6].z += cSNewWidth;
    cactusGeom.vertices[6].y += cSY;
    // middle left
    cactusGeom.vertices[9].z -= cSNewWidth;
    cactusGeom.vertices[9].y += cSY;
    // back right
    cactusGeom.vertices[11].x -= cSNewWidth * 0.85;
    cactusGeom.vertices[11].z += cSNewWidth * 0.5;
    cactusGeom.vertices[11].y += cSY;
    // back left
    cactusGeom.vertices[10].x -= cSNewWidth * 0.85;
    cactusGeom.vertices[10].z -= cSNewWidth * 0.5;
    cactusGeom.vertices[10].y += cSY;

    const cactus1 = new THREE.Mesh(cactusGeom, blueMat);
    cactus1.position.set(0, -30, 0);
    wholeCactus1.add(cactus1);

    // radius top, radius bottom, height, radial segments, height segments
    const flowerCactus1Geom = new THREE.CylinderGeometry(4, 5, 8, 6, 2);
    const fSNewWidth = 4;
    const fSH = 2;

    //front right
    flowerCactus1Geom.vertices[7].x += fSNewWidth * 0.85;
    flowerCactus1Geom.vertices[7].z += fSNewWidth * 0.5;
    flowerCactus1Geom.vertices[7].y += fSH;
    // front left
    flowerCactus1Geom.vertices[8].x += fSNewWidth * 0.85;
    flowerCactus1Geom.vertices[8].z -= fSNewWidth * 0.5;
    flowerCactus1Geom.vertices[8].y += fSH;
    // middle right
    flowerCactus1Geom.vertices[6].z += fSNewWidth;
    flowerCactus1Geom.vertices[6].y += fSH;
    // middle left
    flowerCactus1Geom.vertices[9].z -= fSNewWidth;
    flowerCactus1Geom.vertices[9].y += fSH;
    // back right
    flowerCactus1Geom.vertices[11].x -= fSNewWidth * 0.85;
    flowerCactus1Geom.vertices[11].z += fSNewWidth * 0.5;
    flowerCactus1Geom.vertices[11].y += fSH;
    // back left
    flowerCactus1Geom.vertices[10].x -= fSNewWidth * 0.85;
    flowerCactus1Geom.vertices[10].z -= fSNewWidth * 0.5;
    flowerCactus1Geom.vertices[10].y += fSH;

    const flowerCactus1 = new THREE.Mesh(flowerCactus1Geom, redMat);
    flowerCactus1.position.set(0, -11, 0);
    wholeCactus1.add(flowerCactus1);

    cactusArr.push(wholeCactus1);

    const smallCactus1 = wholeCactus1.clone();
    smallCactus1.scale.set(0.5, 0.5, 0.5);
    smallCactus1.position.set(0, -22, 0);

    smallCactus1.name = "small";

    sCactusArr.push(smallCactus1);

    // 2nd cactus *******************************************************

    const wholeCactus2 = new THREE.Object3D();

    const cactus2 = new THREE.Mesh(cactusGeom, greenMat);
    cactus2.scale.set(1, 0.8, 1);
    cactus2.position.set(0, -30, 0);
    //scene.add(cactus);
    wholeCactus2.add(cactus2);

    const cactus2Branch = cactus2.clone();
    cactus2Branch.scale.set(0.6, 0.8, 0.6);
    cactus2Branch.position.set(0, -15, 0);
    cactus2Branch.rotation.set(0, 0, -Math.PI / 8);
    wholeCactus2.add(cactus2Branch);

    // radius top, radius bottom, height, radial segments, height segments
    // radius, detail (default is 0, if put higher value, make it more sphere like)
    const flowerCactus2Geom = new THREE.DodecahedronGeometry(5);

    const flowerCactus2 = new THREE.Mesh(flowerCactus2Geom, yellowMat);
    flowerCactus2.position.set(8, -6, 4);
    // can't add directly to the cactus
    // otherwise, the scale will affect it
    wholeCactus2.add(flowerCactus2);

    const flower2Cactus2 = flowerCactus2.clone();
    flower2Cactus2.position.set(-7, -15, -5);
    flower2Cactus2.scale.set(1.3, 1.3, 1.3);
    wholeCactus2.add(flower2Cactus2);

    const flower3Cactus2 = flowerCactus2.clone();
    flower3Cactus2.position.set(-5, -25, 15);
    flower3Cactus2.scale.set(0.7, 0.7, 0.7);
    wholeCactus2.add(flower3Cactus2);

    const flower4Cactus2 = flowerCactus2.clone();
    flower4Cactus2.scale.set(0.6, 0.6, 0.6);
    flower4Cactus2.position.set(5, -35, -12);
    wholeCactus2.add(flower4Cactus2);

    cactusArr.push(wholeCactus2);

    const smallCactus2 = wholeCactus2.clone();
    smallCactus2.scale.set(0.5, 0.5, 0.5);
    smallCactus2.position.set(0, -22, 0);

    smallCactus2.name = "small";

    sCactusArr.push(smallCactus2);

    // 3rd cactus *****************************************************

    const wholeCactus3 = new THREE.Object3D();

    const cactus3 = cactus1.clone();
    cactus3.scale.set(0.7, 0.9, 0.3);
    cactus3.rotation.set(0, 0, Math.PI / 8);
    cactus3.position.set(0, -35, 0);
    wholeCactus3.add(cactus3);
    const cactus3Branch1 = cactus1.clone();
    cactus3Branch1.scale.set(0.5, 0.7, 0.2);
    cactus3Branch1.rotation.set(0, 0, -Math.PI / 4);
    cactus3Branch1.position.set(8, -21, 0);
    wholeCactus3.add(cactus3Branch1);
    const cactus3Branch2 = cactus1.clone();
    cactus3Branch2.scale.set(0.4, 0.5, 0.2);
    cactus3Branch2.rotation.set(0, 0, Math.PI / 4);
    cactus3Branch2.position.set(0, -12, 0);
    wholeCactus3.add(cactus3Branch2);

    cactusArr.push(wholeCactus3);

    const smallCactus3 = wholeCactus2.clone();
    smallCactus3.scale.set(0.5, 0.5, 0.5);
    smallCactus3.position.set(0, -22, 0);

    smallCactus3.name = "small";

    sCactusArr.push(smallCactus3);

    // 4th cactus ******************************************************

    const wholeCactus4 = new THREE.Object3D();

    const cactus4Seg1 = cactus1.clone();
    cactus4Seg1.scale.set(1, 1, 0.2);
    wholeCactus4.add(cactus4Seg1);

    const cactus4Seg2 = cactus4Seg1.clone();
    cactus4Seg2.rotation.set(0, Math.PI / 3, 0);
    wholeCactus4.add(cactus4Seg2);

    const cactus4Seg3 = cactus4Seg1.clone();
    cactus4Seg3.rotation.set(0, 2 * Math.PI / 3, 0);
    wholeCactus4.add(cactus4Seg3);

    const flowerCactus4 = new THREE.Mesh(flowerCactus1Geom, yellowMat);
    flowerCactus4.scale.set(0.8, 0.8, 0.8);
    flowerCactus4.position.set(0, -12, 0);
    wholeCactus4.add(flowerCactus4);

    cactusArr.push(wholeCactus4);

    /*cactus.traverse(e => {
          e.castShadow = true;
          e.receiveShadow = true;
      });*/

    //return wholeCactus1;
}

function getObstacle(firstArr, recycledArr, animatedArr, posX) {
    // We randomize the array beforehand
    // We'll recuperate the last element, but it's always a random one
    // since the elements are in a random order
    firstArr.sort(() => Math.random() - 0.5);
    recycledArr.sort(() => Math.random() - 0.5);
    let cactus;
    if (firstArr.length) {
        cactus = firstArr.pop();
    } else {
        cactus = recycledArr.pop();
    }

    cactus.position.x = posX;
    const rotation = Math.floor(Math.random() * 2);
    cactus.rotation.set(0, Math.PI * rotation, 0);
    animatedArr.push(cactus);
    scene.add(cactus);
}

function putObstacleInScene() {
    getObstacle(cactusArr, invisibleObst, visibleObst, limitRight);
    let sCactusFront = Math.random();
    if (sCactusFront < 0.25) {
        getObstacle(sCactusArr, invisibleSObst, visibleSObst, limitRight - 25);
    }
    let sCactusBack = Math.random();
    if (sCactusBack < 0.25) {
        getObstacle(sCactusArr, invisibleSObst, visibleSObst, limitRight + 25);
    }
}

function updateObstacles() {
    animateObstacles(visibleSObst, invisibleSObst);
    animateObstacles(visibleObst, invisibleObst);
}

function animateObstacles(animatedArr, recycledArr) {
    for (let i = 0; i < animatedArr.length; i++) {
        const cactus = animatedArr[i];
        cactus.position.x = cactus.position.x - 5;
        if (cactus.position.x < limitLeft) {
            scene.remove(cactus);
            // recycle the particle
            recycledArr.push(animatedArr.splice(i, 1)[0]);
            // need to go back in the loop, since one element was removed
            i--;
        }
    }
}

export {
    fillcactusArr,
    updateObstacles,
    putObstacleInScene
};