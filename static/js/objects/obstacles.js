import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    multiMat,
    Colors,
    assignColor,
    limitR,
    limitL
} from "/js/scene.js";

import {
    BufferGeometryUtils
} from "/js/three.js/BufferGeometryUtils.js";

import {
    dino,
    dinoPosX
} from "/js/objects/dino.js";

let cactusArr = [];
let sCactusArr = [];
let visibleObst = [];
let visibleSObst = [];
let invisibleObst = [];
let invisibleSObst = [];

const colliderData = {
    // small cactus
    small: {xL: -15, y: 25, xR: 35},
    // normal size
    s1: {xL: -20, y: 35, xR: 40},
    s1Two: {xL: -30, y: 45, xR: 45},
    s1Four: {xL: -35, y: 55, xR: 50},
    s1Six: {xL: -40, y: 65, xR: 50},
    s1Eight: {xL: -40, y: 70, xR: 55},
};

function modifyColor(modelArr1, color1, modelArr2, color2, scale = 1, name = 's1') {
    const arr = [];
    for (let i = 0; i < modelArr1.length; i++) {
        const copy = modelArr1[i].clone();
        if (color1 !== 0) {
            const color = assignColor(color1, copy);
            copy.setAttribute("color", color);
        }
        arr.push(copy);
    }
    for (let i = 0; i < modelArr2.length; i++) {
        const copyFlower = modelArr2[i].clone();
        if (color2 !== 0) {
            const colorFlower = assignColor(color2, copyFlower);
            copyFlower.setAttribute("color", colorFlower);
        }
        arr.push(copyFlower);
    }

    // Merging cactus
    const mergedVersion = BufferGeometryUtils.mergeBufferGeometries(arr, false);
    const result = new THREE.Mesh(mergedVersion, multiMat);
    if (scale !== 1) {
        result.scale.set(scale, scale, scale);
        result.position.y += (scale - 1) * 50;
    }
    result.name = name;
    cactusArr.push(result);
    return result;
}

function makeSmallCopy(model, scale) {
    const smallCopy = model.clone();
    smallCopy.name = "small";
    smallCopy.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -41 + (scale - 0.5) * 120, 0));
    smallCopy.applyMatrix4(new THREE.Matrix4().makeScale(scale, scale, scale));
    sCactusArr.push(smallCopy);
}

function fillcactusArr() {
    // radius top, radius bottom, height, radial segments, height segments
    const cactusGeom = new THREE.CylinderBufferGeometry(10, 10, 30, 6, 2);
    modifyRowCylinder(cactusGeom.attributes.position, 7, 6);
    // will give blue as default color to all copies
    const cactusColor = assignColor(Colors.blue, cactusGeom);
    cactusGeom.setAttribute("color", cactusColor);

    // 1st cactus *** 1st color ***************************************************
    const cactus1Arr = [];
    const cactus1Geom = cactusGeom.clone();
    cactus1Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -30, 0));
    cactus1Arr.push(cactus1Geom);

    // Adding a flower on top
    const cactus1_F_Geom = cactusGeom.clone();
    cactus1_F_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
    cactus1_F_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -11, 0));
    const cactus1_F_Color = assignColor(Colors.red, cactus1_F_Geom);
    cactus1_F_Geom.setAttribute("color", cactus1_F_Color);
    cactus1Arr.push(cactus1_F_Geom);

    // Merging cactus
    const cactus1Merged = BufferGeometryUtils.mergeBufferGeometries(cactus1Arr, false);
    const cactus1_C1 = new THREE.Mesh(cactus1Merged, multiMat);
    cactus1_C1.name = 's1'
    cactusArr.push(cactus1_C1);

    // Other colors
    const cactus1_C2 = modifyColor([cactus1Geom], 0, [cactus1_F_Geom], Colors.yellow);
    /*const cactus1_C3 = modifyColor([cactus1Geom], Colors.yellow, [cactus1_F_Geom], Colors.red);*/

    // Small copies
    makeSmallCopy(cactus1_C1, 0.5);
    makeSmallCopy(cactus1_C1, 0.6);
    makeSmallCopy(cactus1_C1, 0.7);
    makeSmallCopy(cactus1_C2, 0.5);
    makeSmallCopy(cactus1_C2, 0.7);
    /*makeSmallCopy(cactus1_C3, 0.5);*/

    // 2nd cactus *** 1st color ****************************************************

    // need an offset to have the cactus properly center 
    // (so that it doesn't go more to the right or left when is rotated 180 degrees)
    // useful for the collision system
    const cactus2OffsetX = -3;
    
    const cactus2Arr = [];
    const cactus2Geom = cactusGeom.clone();
    cactus2Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.7, 0.9, 0.3));
    cactus2Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 8));
    cactus2Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0 + cactus2OffsetX, -35, 0));
    cactus2Arr.push(cactus2Geom);

    const cactus2_B1_Geom = cactusGeom.clone();
    cactus2_B1_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.7, 0.2));
    cactus2_B1_Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 4));
    cactus2_B1_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(8 + cactus2OffsetX, -21, 0));
    cactus2Arr.push(cactus2_B1_Geom);

    const cactus2_B2_Geom = cactusGeom.clone();
    cactus2_B2_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.4, 0.5, 0.2));
    cactus2_B2_Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4));
    cactus2_B2_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0 + cactus2OffsetX, -12, 0));
    cactus2Arr.push(cactus2_B2_Geom);

    // Merging cactus
    const cactus2Merged = BufferGeometryUtils.mergeBufferGeometries(cactus2Arr, false);
    const cactus2_C1 = new THREE.Mesh(cactus2Merged, multiMat);
    cactus2_C1.name = 's1'

    cactusArr.push(cactus2_C1);

    // Other colors
    modifyColor([cactus2Geom, cactus2_B1_Geom, cactus2_B2_Geom], 0, [], 0, 1.6, 's1Six');
    modifyColor([cactus2Geom, cactus2_B1_Geom, cactus2_B2_Geom], Colors.yellow, [], 0, 1.8, 's1Eight');
    modifyColor([cactus2Geom, cactus2_B1_Geom, cactus2_B2_Geom], Colors.red, [], 0, 1.2, 's1Two');
    modifyColor([cactus2Geom, cactus2_B1_Geom, cactus2_B2_Geom], Colors.green, [], 0, 1.4, 's1Four');
}

function getObstacle(firstArr, recycledArr, animatedArr, posX) {
    // We randomize the array beforehand
    // We'll recuperate the last element, but it's always a random one
    // since the elements are in a random order
    firstArr.sort(() => Math.random() - 0.5);
    recycledArr.sort(() => Math.random() - 0.5);
    let cactus;
    if (firstArr.length) {
        // console.log("big cactus");
        cactus = firstArr.pop();
    } else {
        // console.log("small");
        cactus = recycledArr.pop();
    }

    cactus.position.x = posX;
    const rotation = Math.floor(Math.random() * 2);
    cactus.rotation.set(0, Math.PI * rotation, 0);
    animatedArr.push(cactus);
    scene.add(cactus);
}

function putObstacleInScene() {
    getObstacle(cactusArr, invisibleObst, visibleObst, limitR);

    let sCactusFront = Math.random();
    if (sCactusFront < 0.25) {
        getObstacle(sCactusArr, invisibleSObst, visibleSObst, limitR - 30);
    }
    let sCactusBack = Math.random();
    if (sCactusBack < 0.25) {
        getObstacle(sCactusArr, invisibleSObst, visibleSObst, limitR + 30);
    }
}

function updateObstacles(speed) {
    animateObstacles(visibleSObst, invisibleSObst, speed);
    animateObstacles(visibleObst, invisibleObst, speed);
}

function animateObstacles(animatedArr, recycledArr, speed) {
    for (let i = 0; i < animatedArr.length; i++) {

        const cactus = animatedArr[i];
        const cactusX = cactus.position.clone().x;
        const dinoX = dino.mesh.position.clone().x;
        const dinoY = dino.mesh.position.clone().y;

        // the lower the number, the less "collision surface" there is for each cactus
        const tolerance = 0.7;

        cactus.position.x = cactus.position.x - speed;

        if(cactusX > colliderData[cactus.name].xL * tolerance + dinoX 
            && cactusX < colliderData[cactus.name].xR * tolerance + dinoX
            && dinoY < colliderData[cactus.name].y * tolerance) {
            // console.log('**************TOUCHING**************');
        }

        if (cactus.position.x < limitL) {
            scene.remove(cactus);
            // recycle the particle
            recycledArr.push(animatedArr.splice(i, 1)[0]);
            // need to go back in the loop, since one element was removed
            i--;
        }
    }
}

function modifyRowCylinder(posAttribute, newWidth, posY) {
    //front right
    const xC8 = posAttribute.getX(8) + newWidth * 0.85;
    const yC8 = posAttribute.getY(8) + posY;
    const zC8 = posAttribute.getZ(8) + newWidth * 0.5
    posAttribute.setXYZ(8, xC8, yC8, zC8);
    // front left
    const xC9 = posAttribute.getX(9) + newWidth * 0.85;
    const yC9 = posAttribute.getY(9) + posY;
    const zC9 = posAttribute.getZ(9) - newWidth * 0.5
    posAttribute.setXYZ(9, xC9, yC9, zC9);

    // 2 vertices need to be moved for the buffer geometry version
    // otherwise, leaves a hole
    // middle right
    const yC7 = posAttribute.getY(7) + posY;
    const zC7 = posAttribute.getZ(7) + newWidth;
    posAttribute.setXYZ(7, posAttribute.getX(7), yC7, zC7);

    const yC13 = posAttribute.getY(13) + posY;
    const zC13 = posAttribute.getZ(13) + newWidth;
    posAttribute.setXYZ(13, posAttribute.getX(13), yC13, zC13);

    // middle left
    const yC10 = posAttribute.getY(10) + posY;
    const zC10 = posAttribute.getZ(10) - newWidth;
    posAttribute.setXYZ(10, posAttribute.getX(10), yC10, zC10);
    // back right
    const xC12 = posAttribute.getX(12) - newWidth * 0.85;
    const yC12 = posAttribute.getY(12) + posY;
    const zC12 = posAttribute.getZ(12) + newWidth * 0.5;
    posAttribute.setXYZ(12, xC12, yC12, zC12);
    // back left
    const xC11 = posAttribute.getX(11) - newWidth * 0.85;
    const yC11 = posAttribute.getY(11) + posY;
    const zC11 = posAttribute.getZ(11) - newWidth * 0.5;
    posAttribute.setXYZ(11, xC11, yC11, zC11);
}

export {
    fillcactusArr,
    updateObstacles,
    putObstacleInScene
};