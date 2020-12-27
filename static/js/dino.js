import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    redMat,
    whiteMat
} from "/js/scene.js";

let dino;

function Dino() {
    this.mesh = new THREE.Object3D();
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 1:X 2:Y 3:Z
    const headGeom = new THREE.BoxGeometry(30, 20, 20);
    // To create an object in Three.js, we have to create a mesh
    // which is a combination of a geometry and some material
    const head = new THREE.Mesh(headGeom, redMat);
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

const createDino = function () {
    // name of the instance = new instance of the function
    // the variable of the instance needs to be declared somewhere in the global scope
    dino = new Dino();
    // Need to put name of the object (or of the "container") we want to render
    scene.add(dino.mesh);
}

export {
    createDino
};