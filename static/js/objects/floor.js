import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    yellowMat,
    blueMat,
    greenMat,
    whiteMatFloor
} from "/js/scene.js";

let visibleFloor = [];
let invisibleFloor = [];

// settings are easier to tweak in one place
const limitFloorLeft = -650;
const floorScale = 400;
const numFloorInScene = 4;

// No need for too much randomness, since will just clone it
// can add the randomness later by scaling and rotating
function createCactus() {
    const thickness = 12;

    // Always use BufferGeometry instead of Geometry, it’s faster.
    // ref => https://discoverthreejs.com/tips-and-tricks/
    const cactusGeom = new THREE.BoxBufferGeometry(12, 90, 12);
    const cactus = new THREE.Mesh(cactusGeom, blueMat);

    const thickness1 = 8;
    const length1 = 15;
    // substract half of the parent and half of the child to align on the border
    const branch1X = -thickness / 2 - length1 / 2;

    const branch1Geom = new THREE.BoxBufferGeometry(15, 8, 8);
    const branch1 = new THREE.Mesh(branch1Geom, blueMat);
    branch1.position.set(branch1X, 8, 0);
    cactus.add(branch1);

    const height1S = 15;
    const branch1SX = -(length1 - thickness1) / 2;
    const branch1SY = (height1S - thickness1) / 2;

    const branch1SGeom = new THREE.BoxBufferGeometry(8, 15, 8);
    const branch1S = new THREE.Mesh(branch1SGeom, blueMat);
    branch1S.position.set(branch1SX, branch1SY, 0);
    branch1.add(branch1S);

    const branch2 = branch1.clone();
    branch2.rotation.set(0, Math.PI, 0);
    branch2.scale.set(0.8, 0.8, 0.8);
    branch2.position.set(12, 25, 0);
    cactus.add(branch2);

    return cactus;
}

function createFloor() {
    // example on how to distort a plane
    // https://jsfiddle.net/h4oytk1a/1/

    // size, number of segments
    const geomFloor = new THREE.PlaneBufferGeometry(floorScale, floorScale, 10, 10);

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

    // Always use BufferGeometry instead of Geometry, it’s faster.
    // ref => https://discoverthreejs.com/tips-and-tricks/
    let stoneGeom = new THREE.BoxBufferGeometry(20, 20, 20);

    const stoneYellow = new THREE.Mesh(stoneGeom, yellowMat);
    const stoneGreen = new THREE.Mesh(stoneGeom, greenMat);
    // container for the stones
    const stones = new THREE.Object3D();
    const cactusRow = new THREE.Object3D();

    // declare stone outside of if scope (below), otherwise, can not access it
    let stone;

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

    const cactus = createCactus();

    // the plane is rotated => y = z
    // the plane is rotated => z = y

    const cactusNum = 3 + Math.ceil(Math.random() * 2);

    for (let i = 0; i < cactusNum; i++) {
        const r = Math.floor(Math.random() * 5);
        const s = 0.3 + Math.random() * 0.6;
        // cloning is better for performance
        // than making a new one
        const c = cactus.clone();
        const d = Math.random() * 25;
        c.scale.set(s, s, s);
        c.position.set(i * 40 + d, 160, 20 + s * 13);
        c.rotation.set(Math.PI / 2, r * Math.PI / 2, 0);
        cactusRow.add(c);
    }

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

        let s = 0.2 + Math.random() * 0.6;
        // constructing stones and floor at the same time
        // has the downside of making the repetitive floor more obvious
        // but solves the problem of the random height for the stones
        // floating above the ground, or being too deep in
        // + can animate and recycle them together
        const isThereAStone = Math.random();
        const stoneFront = Math.random();
        const stoneColor = Math.random();

        if (isThereAStone < 0.175 && (i < 44 || (i > 76 && stoneFront < 0.4))) {
            if (stoneColor < 0.65) {
                // Object creation in JavaScript is expensive
                // Making a clone is often a better option, for performance
                stone = stoneYellow.clone();
            } else {
                stone = stoneGreen.clone();
            }

            stone.scale.set(s, s, s);
            // the plane is rotated => y = z
            // the plane is rotated => z = y
            z -= s * 3;
            stone.position.set(x, y, z);
            stones.add(stone);
        }
    }

    // I use a different material for the floor, since I find it too greyish
    // and since I think the lighting is not too bad, it's an easy fix
    const floor = new THREE.Mesh(geomFloor, whiteMatFloor);
    floor.add(stones);
    floor.add(cactusRow);
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
    let posX = limitFloorLeft;
    for (let i = 0; i < numFloorInScene; i++) {
        putFloorInScene(posX);
        posX += floorScale;
    }
}

function updateFloor() {
    for (let i = 0; i < visibleFloor.length; i++) {
        const floor = visibleFloor[i];
        floor.position.x -= 7;
        // check if the particle is out of the field of view
        if (floor.position.x < limitFloorLeft) {
            scene.remove(floor);
            // recycle the particle
            invisibleFloor.push(visibleFloor.splice(i, 1)[0]);
            putFloorInScene(limitFloorLeft + floorScale * (numFloorInScene - 1));
            i--;
        }
    }
}

export {
    fillFloor,
    updateFloor
};