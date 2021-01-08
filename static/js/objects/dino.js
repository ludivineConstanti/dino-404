import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    redMat,
    whiteMat
} from "/js/scene.js";

import {
    dinoSpeed
} from "/js/main.js"

// makes dino available to global scope
let dino;

let jumpDuration = 0;
let landed = false;

// positions are a nightmare to update when need to change it in translate + set + the children 
// + animation functions...
// here, we can update everything at once
// put every settings influenced by translate

// set position for the translated object => opposite of translation
// (+ whatever value we wanted)
// children = same as translation (+ translation value)

// Body
// the body's position is dependent on the feet
// (cause it can't float)
// so its center should be lower 
const bodyYTranslate = 10;
const bodyY = -24 - bodyYTranslate;
// Head
const headXTranslate = 5;
const headYTranslate = 10;
const headX = 4 - headXTranslate;
const headY = 24 - headYTranslate + bodyYTranslate;
// Head children
const eyeRX = -7.5 + headXTranslate;
const eyeRY = 2.5 + headYTranslate;
const eyeLX = eyeRX;
const eyeLY = eyeRY;
const mouthXTranslate = 6;
const mouthX = 0 - mouthXTranslate + headXTranslate;
const mouthY = -11.5 + headYTranslate;
// Arms
const armXTranslate = 3.5;
const armRX = 2 - armXTranslate;
const armRY = 8 + bodyYTranslate;
// Arms children
const handX = 2 + armXTranslate;
// Legs
const legXTranslate = 0;
const legYTranslate = -6;
const legRX = 0 - legXTranslate;
const legRY = -8 - legYTranslate + bodyYTranslate;
// Legs children
const footXTranslate = 4;
const footYTranslate = -1.5;
const footX = 0.5 - footXTranslate + legXTranslate;
// Foot doesn't need the bodyYTranslate value since leg already takes it into account
// and children's position is relative to their parent
const footY = -7 - footYTranslate + legYTranslate;
// Tail
const tailY = -4 + bodyYTranslate;
// Tail1
const tailYTranslate = 6;
const tail1Y = -tailYTranslate;
// Tail1's child
const tail2Y = 3 + tailYTranslate;


function Dino() {
    this.mesh = new THREE.Object3D();

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
    bodyGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, bodyYTranslate, 0));
    this.body.position.set(-5, bodyY, 0);
    this.mesh.add(this.body);

    const armGeom = new THREE.BoxBufferGeometry(7, 3, 3);
    // modify the arm's origin
    armGeom.applyMatrix(new THREE.Matrix4().makeTranslation(armXTranslate, 0, 0));
    this.armR = new THREE.Mesh(armGeom, redMat);
    // modify the arm's position
    this.armR.position.set(armRX, armRY, 9.5);
    this.body.add(this.armR);

    const handGeom = new THREE.BoxBufferGeometry(3, 3, 3);
    this.hand = new THREE.Mesh(handGeom, redMat);
    this.hand.position.set(handX, -1.5, 0);
    this.armR.add(this.hand);

    this.armL = this.armR.clone();
    this.armL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    this.body.add(this.armL);

    // width, height, depth, width segments, height segments
    const legGeom = new THREE.BoxGeometry(13, 14, 8, 1, 2);
    legGeom.applyMatrix(new THREE.Matrix4().makeTranslation(legXTranslate, legYTranslate, 0));

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
    this.legR.position.set(legRX, legRY, 10);
    this.body.add(this.legR);

    const footGeom = new THREE.BoxBufferGeometry(10, 3.5, 5);
    // modify foot's origin
    footGeom.applyMatrix(new THREE.Matrix4().makeTranslation(footXTranslate, footYTranslate, 0));
    this.foot = new THREE.Mesh(footGeom, redMat);
    // modify foot's final position
    this.foot.position.set(footX, footY, -1);
    this.legR.add(this.foot);

    this.legL = this.legR.clone();
    // modify the leg's center
    // without it, the leg is not properly mirrored
    // but it's not possible to tell, since the dino is not seen from this side
    //this.legL.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    this.legL.position.set(legRX, legRY, -10);
    this.body.add(this.legL);

    this.tail = new THREE.Object3D();
    this.tail.position.set(-11, tailY, 0);
    //this.tail.position.set(-50, -2.5, 0);
    this.tail.rotation.set(0, 0, Math.PI / 2);
    this.body.add(this.tail);

    const tailGeom = new THREE.BoxGeometry(13, 12, 12);
    tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, tailYTranslate, 0));
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

    // tail is rotated, so modify x for global y
    // and y for global x
    this.tail1 = new THREE.Mesh(tailGeom, redMat);
    this.tail1.position.set(0, tail1Y, 0);

    this.tail.add(this.tail1);

    this.tail2 = this.tail1.clone();
    this.tail2.scale.set(0.7, 0.7, 0.7);
    this.tail2.position.set(1, tail2Y, 0);
    this.tail2.rotation.set(0, 0, -Math.PI / 4);
    this.tail1.add(this.tail2);

    this.tail3 = this.tail2.clone();
    //this.tail3.position.set(0, 0, 0);
    this.tail3.scale.set(0.7, 0.7, 0.7);
    this.tail2.add(this.tail3);

    // 1:X 2:Y 3:Z
    // Always use BufferGeometry instead of Geometry, it’s faster.
    // ref => https://discoverthreejs.com/tips-and-tricks/
    const headGeom = new THREE.BoxBufferGeometry(30, 20, 20);
    // modify the arm's origin
    headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(headXTranslate, headYTranslate, 0));
    // To create an object in Three.js, we have to create a mesh
    // which is a combination of a geometry and some material
    this.head = new THREE.Mesh(headGeom, redMat);
    this.head.position.set(headX, headY, 0);
    this.body.add(this.head);

    const eyeGeom = new THREE.BoxBufferGeometry(5, 5, 5);
    this.eyeR = new THREE.Mesh(eyeGeom, whiteMat);
    this.eyeL = this.eyeR.clone();
    // 1:X 2:Y 3:Z
    // X => negative values to the left, positive values to the right
    // the added cube is by default in the middle
    this.eyeR.position.set(eyeRX, eyeRY, 9);
    this.eyeL.position.set(eyeLX, eyeLY, -9);
    this.head.add(this.eyeR);
    this.head.add(this.eyeL);

    // Can not access the vertices if ues BufferGeometry
    const mouthGeom = new THREE.BoxGeometry(14, 3, 14);
    mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(mouthXTranslate, 0, 0));

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
    this.mouth.position.set(mouthX, mouthY, 0);
    this.head.add(this.mouth);

    this.mesh.traverse(e => {
        e.castShadow = true;
        e.receiveShadow = true;
    });
}

const createDino = function () {
    // name of the instance = new instance of the function
    // the variable of the instance needs to be declared somewhere in the global scope
    dino = new Dino();
    dino.mesh.position.x = -120;
    // Need to put name of the object (or of the "container") we want to render
    scene.add(dino.mesh);
}

// ref => https://codepen.io/Yakudoo/pen/qXaNeN?editors=0010
Dino.prototype.run = function () {
    // X => Math.cos()
    // Y => Math.sin()
    // X : Y values =>
    // angle   0 =>  1 :  0
    // angle  90 =>  0 :  1
    // angle 180 => -1 :  0
    // angle 270 =>  0 : -1
    // always 1 step late / in advance compared to the other
    // choose the z value depending on which one want to be synchrone with

    // Rotation => will make a full circle when reaches 2PI
    // cos and sin are between -1 and 1
    // will never make a full circle unless multiplies by an other value

    // turn opposite to the clockwise direction
    // need to use negative sin and cos if want it to turn in the other direction

    this.body.rotation.z = Math.cos(dinoSpeed * 2) * 0.15 - 0.3;
    this.body.rotation.y = Math.cos(dinoSpeed) * 0.2;

    //this.head.position.y = Math.sin(dinoSpeed) * 0.1;
    //this.head.rotation.z = -Math.cos(dinoSpeed + Math.PI) * 0.03;
    this.head.rotation.z = Math.cos(dinoSpeed * 2) * 0.1;
    this.mouth.rotation.z = -Math.cos(dinoSpeed * 2 + Math.PI) * 0.08;

    this.armR.rotation.z = -Math.cos(dinoSpeed) * 0.5;

    this.tail1.rotation.z = Math.cos(dinoSpeed * 2) * 0.2;
    this.tail2.rotation.z = (Math.cos(dinoSpeed * 2) * 0.1) - Math.PI / 4;
    this.tail3.rotation.z = (Math.cos(dinoSpeed * 2) * 0.1) - Math.PI / 4;

    this.legR.position.y = -(Math.sin(dinoSpeed) * 2) + legRY;
    this.legR.rotation.z = Math.cos(dinoSpeed);
    this.foot.rotation.z = -Math.cos(dinoSpeed) * 0.5;

    this.legL.position.y = -(Math.sin(dinoSpeed + Math.PI) * 2) + legRY;
    this.legL.rotation.z = Math.cos(dinoSpeed + Math.PI);
}

Dino.prototype.jump = function () {
    landed = false;
    if (this.mesh.position.y < 60) {
        this.mesh.position.y += 12;
    }
    this.body.rotation.z = -Math.PI / 10;
    if (this.legR.rotation.z < Math.PI / 2.5) {
        this.legR.rotation.z += 0.6;
    }
    if (this.legL.rotation.z < Math.PI / 2.5) {
        this.legL.rotation.z += 0.6;
    }
    jumpDuration++;
}

Dino.prototype.land = function () {
    if (this.legL.rotation.z > 0.4) {
        this.legL.rotation.z -= 0.2;
    }
    if (this.legR.rotation.z > 0.4) {
        this.legR.rotation.z -= 0.2;
    }
    if (this.armR.rotation.z > -Math.PI / 4) {
        this.armR.rotation.z -= 0.1;
    }
    if (this.mesh.position.y > 0) {
        this.mesh.position.y -= 10;
        landed = false;
    }
    // makes sure that the Dino doesn't go below the ground
    if (this.mesh.position.y < 0) {
        this.mesh.position.y = Math.max(0, this.mesh.position.y);
    }
    if (this.mesh.position.y === 0) {
        landed = true;
        jumpDuration = 0;
    }
}

export {
    createDino,
    dino,
    jumpDuration,
    landed
};