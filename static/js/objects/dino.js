import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    redMat,
    whiteMat
} from "/js/scene.js";

import {
    tailRotation,
    dinoSpeed
} from "/js/main.js"

// makes dino available to global scope
let dino;

function Dino() {
    this.mesh = new THREE.Object3D();

    // 1:X 2:Y 3:Z
    // Always use BufferGeometry instead of Geometry, it’s faster.
    // ref => https://discoverthreejs.com/tips-and-tricks/
    const headGeom = new THREE.BoxBufferGeometry(30, 20, 20);
    // To create an object in Three.js, we have to create a mesh
    // which is a combination of a geometry and some material
    this.head = new THREE.Mesh(headGeom, redMat);
    this.mesh.add(this.head);

    const eyeGeom = new THREE.BoxBufferGeometry(5, 5, 5);
    this.eyeR = new THREE.Mesh(eyeGeom, whiteMat);
    this.eyeL = this.eyeR.clone();
    // 1:X 2:Y 3:Z
    // X => negative values to the left, positive values to the right
    // the added cube is by default in the middle
    this.eyeR.position.set(-7.5, 2.5, 9);
    this.eyeL.position.set(-7.5, 2.5, -9);
    this.head.add(this.eyeR);
    this.head.add(this.eyeL);

    // Can not access the vertices if ues BufferGeometry
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

    this.mouth = new THREE.Mesh(mouthGeom, redMat);
    // Y => negative values to the bottom, positive values to the top
    this.mouth.position.set(0, -11.5, 0);
    this.head.add(this.mouth);

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

    this.body = new THREE.Mesh(bodyGeom, redMat);
    this.body.position.set(-5, -24, 0);
    this.mesh.add(this.body);

    const armGeom = new THREE.BoxBufferGeometry(7, 3, 3);
    this.armR = new THREE.Mesh(armGeom, redMat);
    this.armR.position.set(1, 8, 9.5);
    this.body.add(this.armR);

    const handGeom = new THREE.BoxBufferGeometry(3, 3, 3);
    this.hand = new THREE.Mesh(handGeom, redMat);
    this.hand.position.set(2, -1.5, 0);
    this.armR.add(this.hand);

    this.armL = this.armR.clone();
    this.armL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    this.body.add(this.armL);

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

    this.legR = new THREE.Mesh(legGeom, redMat);
    this.legR.position.set(0, -8, 10);
    this.body.add(this.legR);

    const footGeom = new THREE.BoxBufferGeometry(10, 3.5, 5);
    this.foot = new THREE.Mesh(footGeom, redMat);
    this.foot.position.set(0.5, -8.5, -1);
    this.legR.add(this.foot);

    this.legL = this.legR.clone();
    this.legL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    this.body.add(this.legL);

    this.tail = new THREE.Object3D();
    this.tail.position.set(-12, -2.5, 0);
    this.tail.rotation.set(0, 0, Math.PI / 2);
    this.body.add(this.tail);

    const tailGeom = new THREE.BoxGeometry(13, 12, 12);

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
    this.tail1 = new THREE.Mesh(tailGeom, redMat);

    // smaller number turns toward right
    // 180° = PI = 3.14... can use Math.PI
    this.tail.add(this.tail1);

    this.tail2 = this.tail1.clone();
    this.tail2.scale.set(0.7, 0.7, 0.7);
    this.tail2.position.set(4, 5, 0);
    this.tail2.rotation.set(0, 0, -Math.PI / 4);
    this.tail1.add(this.tail2);

    this.tail3 = this.tail2.clone();
    this.tail2.scale.set(0.7, 0.7, 0.7);
    //tail2.rotation.set(0, 0, Math.PI / 10);
    this.tail2.add(this.tail3);

    this.mesh.traverse(e => {
        e.castShadow = true;
        e.receiveShadow = true;
    });
}

const createDino = function () {
    // name of the instance = new instance of the function
    // the variable of the instance needs to be declared somewhere in the global scope
    dino = new Dino();
    //dino.mesh.position.x = -75;
    // Need to put name of the object (or of the "container") we want to render
    scene.add(dino.mesh);
}

// ref => https://codepen.io/Yakudoo/pen/qXaNeN?editors=0010
Dino.prototype.run = function () {
    this.tail1.position.x = -Math.cos(dinoSpeed) * 1.2;
    this.tail1.rotation.z = Math.cos(dinoSpeed) * 0.2;
    this.tail2.rotation.z = (Math.cos(dinoSpeed) * 0.1) - Math.PI / 4;
    this.tail3.rotation.z = (Math.cos(dinoSpeed) * 0.1) - Math.PI / 4;

    this.legR.position.y = (Math.sin(dinoSpeed) * 2) - 7;
    this.legR.position.y = Math.max(-9, this.legR.position.y);
    this.legR.position.x = -Math.cos(dinoSpeed) * 2;

    this.foot.rotation.z = Math.cos(dinoSpeed);

    this.legL.position.y = (Math.sin(dinoSpeed + Math.PI) * 1.5) - 7;
    this.legL.position.x = -Math.cos(dinoSpeed + Math.PI) * 0.8;

    this.mesh.position.y = Math.sin(dinoSpeed * 2);

    this.head.position.y = Math.sin(dinoSpeed) * 0.1;
    this.head.rotation.z = -Math.cos(dinoSpeed + Math.PI) * 0.03;
    this.mouth.rotation.z = -Math.cos(dinoSpeed + Math.PI) * 0.05;

    //this.armR.rotation.y = Math.sin(dinoSpeed) * 0.1;
    this.armR.rotation.z = Math.sin(dinoSpeed) * 0.3;

    // Body rotated forward ****************************************************************************

    this.mesh.rotation.z = -0.6;

    this.head.rotation.z = 0.4;
    //this.head.rotation.z = (Math.cos(dinoSpeed + Math.PI) * 0.1) + 0.4;
    this.head.position.x = (Math.cos(dinoSpeed + Math.PI) * 0.7) + 0.3;
    this.head.position.y = -(Math.sin(dinoSpeed + Math.PI)) + 1;

    this.armR.position.x = 7;
    this.armR.position.y = (Math.sin(dinoSpeed) * 0.6) + 7;
    this.armR.rotation.z = Math.sin(dinoSpeed) * 0.3;

    this.hand.rotation.z = Math.sin(dinoSpeed) * 0.5;

    this.legR.rotation.z = 0.6;
    //this.legR.rotation.z = Math.cos(dinoSpeed) + 0.6;

    this.tail1.position.x = (-Math.cos(dinoSpeed) * 1.2) - 7;
    this.tail1.rotation.z = (Math.cos(dinoSpeed) * 0.2) + 0.3;
    this.tail2.rotation.z = (Math.cos(dinoSpeed) * 0.3) - Math.PI / 4;
    this.tail3.rotation.z = (Math.cos(dinoSpeed) * 0.3) - Math.PI / 4;
}

export {
    createDino,
    dino
};