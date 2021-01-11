import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    redMat,
    blueMat,
    yellowMat,
    greenMat,
    whiteMat,
    multiMat,
    Colors,
    assignColor,
} from "/js/scene.js";

import {
    BufferGeometryUtils
} from "/js/three.js/BufferGeometryUtils.js";

let cactusArr = [];
let sCactusArr = [];
let visibleObst = [];
let visibleSObst = [];
let invisibleObst = [];
let invisibleSObst = [];
const limitLeft = -400;
const limitRight = -limitLeft;

function modifyColor(modelArr1, color1, modelArr2, color2, pushInArray) {
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
    if (pushInArray) {
        cactusArr.push(result);
    }
    return result;
}

function makeSmallCopy(model) {
    const smallCopy = model.clone();
    smallCopy.name = "small";
    smallCopy.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -41, 0));
    smallCopy.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
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
    const cactus1_F_Geom = new THREE.CylinderBufferGeometry(4, 5, 8, 6, 2);
    modifyRowCylinder(cactus1_F_Geom.attributes.position, 4, 2);
    cactus1_F_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -11, 0));
    const cactus1_F_Color = assignColor(Colors.red, cactus1_F_Geom);
    cactus1_F_Geom.setAttribute("color", cactus1_F_Color);
    cactus1Arr.push(cactus1_F_Geom);

    // Merging cactus
    const cactus1Merged = BufferGeometryUtils.mergeBufferGeometries(cactus1Arr, false);
    const cactus1_C1 = new THREE.Mesh(cactus1Merged, multiMat);
    cactusArr.push(cactus1_C1);

    // Other colors
    const cactus1_C2 = modifyColor([cactus1Geom], 0, [cactus1_F_Geom], Colors.yellow, true);
    const cactus1_C3 = modifyColor([cactus1Geom], Colors.yellow, [cactus1_F_Geom], Colors.red, true);

    // Small copies
    makeSmallCopy(cactus1_C1);
    makeSmallCopy(cactus1_C2);
    makeSmallCopy(cactus1_C3);

    // 2nd cactus *** 1st color ****************************************************

    /*const cactus2Arr = [];
    const cactus2_F_Arr = [];
    const cactus2Geom = cactusGeom.clone();
    cactus2Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.9, 0.7, 0.9));
    cactus2Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -30, 0));
    cactus2Arr.push(cactus2Geom);

    const cactus2_B_Geom = cactusGeom.clone();
    cactus2_B_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.65, 0.6, 0.65));
    cactus2_B_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(11, -15.5, 0));
    cactus2_B_Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 5));
    cactus2Arr.push(cactus2_B_Geom);

    // Merging cactus
    const cactus2Merged = BufferGeometryUtils.mergeBufferGeometries(cactus2Arr, false);
    const cactus2_C1 = new THREE.Mesh(cactus2Merged, multiMat);

    const cactus2_F1_Geom = new THREE.DodecahedronBufferGeometry(5);
    cactus2_F1_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(-11, -26, 9));
    const cactus2_F1_Color = assignColor(Colors.red, cactus2_F1_Geom);
    cactus2_F1_Geom.setAttribute("color", cactus2_F1_Color);
    cactus2_F_Arr.push(cactus2_F1_Geom);

    const cactus2_F2_Geom = cactus2_F1_Geom.clone();
    cactus2_F2_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
    cactus2_F2_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(15, -7, 3));
    cactus2_F_Arr.push(cactus2_F2_Geom);

    const cactus2_F3_Geom = cactus2_F1_Geom.clone();
    cactus2_F3_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.7, 0.7, 0.7));
    cactus2_F3_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(4, 4, -13));
    cactus2_F_Arr.push(cactus2_F3_Geom);

    // Merging flowers
    const cactus2_F_Merged = BufferGeometryUtils.mergeBufferGeometries(cactus2_F_Arr, false);
    const cactus2_F_C1 = new THREE.Mesh(cactus2_F_Merged, multiMat);

    // The geometry shape of the flower is incompatible, with the one of the cactus
    // they need to be added separately
    cactus2_C1.add(cactus2_F_C1);
    cactusArr.push(cactus2_C1);

    // Other colors
    const cactus2_C2 = modifyColor([cactus2Geom, cactus2_B_Geom], Colors.yellow, [], 0, false);
    cactus2_C2.add(cactus2_F_C1.clone());
    cactusArr.push(cactus2_C2);

    // Small copies
    makeSmallCopy(cactus2_C1);
    makeSmallCopy(cactus2_C2);*/

    // 3rd cactus *****************************************************

    const cactus3Arr = [];
    const cactus3Geom = cactusGeom.clone();
    cactus3Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.7, 0.9, 0.3));
    cactus3Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 8));
    cactus3Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -35, 0));
    cactus3Arr.push(cactus3Geom);

    const cactus3_B1_Geom = cactusGeom.clone();
    cactus3_B1_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.5, 0.7, 0.2));
    cactus3_B1_Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 4));
    cactus3_B1_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(8, -21, 0));
    cactus3Arr.push(cactus3_B1_Geom);

    const cactus3_B2_Geom = cactusGeom.clone();
    cactus3_B2_Geom.applyMatrix4(new THREE.Matrix4().makeScale(0.4, 0.5, 0.2));
    cactus3_B2_Geom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4));
    cactus3_B2_Geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -12, 0));
    cactus3Arr.push(cactus3_B2_Geom);

    // Merging cactus
    const cactus3Merged = BufferGeometryUtils.mergeBufferGeometries(cactus3Arr, false);
    const cactus3_C1 = new THREE.Mesh(cactus3Merged, multiMat);

    cactusArr.push(cactus3_C1);

    // Other colors
    const cactus3_C2 = modifyColor([cactus3Geom, cactus3_B1_Geom, cactus3_B2_Geom], Colors.yellow, [], 0, true);
    const cactus3_C3 = modifyColor([cactus3Geom, cactus3_B1_Geom, cactus3_B2_Geom], Colors.red, [], 0, true);
    const cactus3_C4 = modifyColor([cactus3Geom, cactus3_B1_Geom, cactus3_B2_Geom], Colors.green, [], 0, true);

    // Small copies
    makeSmallCopy(cactus3_C1);
    makeSmallCopy(cactus3_C2);
    makeSmallCopy(cactus3_C3);
    makeSmallCopy(cactus3_C4);

    /*cactus.traverse(e => {
          e.castShadow = true;
          e.receiveShadow = true;
      });*/

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