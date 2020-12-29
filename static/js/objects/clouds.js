import * as THREE from "/js/three.js/three.module.js";

import {
    scene,
    whiteMat
} from "/js/scene.js";

let visibleClouds = [];
let invisibleClouds = [];
const limitCloudLeft = -500;
const limitCloudRight = -limitCloudLeft;


function createCloud() {
    // Create an empty container that will hold the different parts of the cloud
    const cloud = new THREE.Object3D();

    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    const cloudScale = 20;

    // Always use BufferGeometry instead of Geometry, it’s faster.
    // ref => https://discoverthreejs.com/tips-and-tricks/
    let geomCloud = new THREE.BoxBufferGeometry(cloudScale, cloudScale, cloudScale);

    for (let i = 0; i < 3; i++) {
        // create the mesh by cloning the geometry
        let c = new THREE.Mesh(geomCloud, whiteMat);

        const randomScale = 0.4 + Math.random() * 0.4;
        // put the cloud down half the size of the main block
        // and up half the size of the random sized block
        // blocks are therefore aligned on the bottom instead of centered
        const posY = -cloudScale / 2 + (randomScale * cloudScale) / 2;

        // set the position of each cube randomly
        c.position.x = i * 14;
        c.position.y = i === 1 ? 0 : posY;
        c.position.z = -2.5 + Math.random() * 6;

        // set the size of the cube (at the extremity) randomly
        // the one in the middle stays the same
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
        putCloudInSky(posX);
    }
}

function updateCloud() {
    for (let i = 0; i < visibleClouds.length; i++) {
        const cloud = visibleClouds[i];
        const z = cloud.position.z;
        cloud.position.x -= 0.5;
        // check if the particle is out of the field of view
        if (cloud.position.x < limitCloudLeft) {
            scene.remove(cloud);
            // recycle the particle
            invisibleClouds.push(visibleClouds.splice(i, 1)[0]);
            i--;
        }
    }
}

export {
    fillSky,
    updateCloud,
    putCloudInSky,
    visibleClouds,
    invisibleClouds,
    limitCloudLeft,
    limitCloudRight
};