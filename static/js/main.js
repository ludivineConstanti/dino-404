import * as THREE from "/js/three.js/three.module.js";

// There's more than one version of OrbitControls
// need to make sure to use the module one
// to be able to import it this way (same for THREE.js)
import {
    OrbitControls
}
from "/js/three.js/OrbitControls.js";

const Colors = {
    red: 0xEF4239,
    blue: 0x4284F7,
    green: 0x31AB52,
    yellow: 0xFFBD08
};

window.addEventListener('load', init, false);

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
let controls;
let shadowLight;
let cube;

function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();

    // add the objects
    createObjects();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    loop();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.noZoom = true;
}

function createScene() {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera 
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 10;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 0;

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,

        // Activate the anti-aliasing; this is less performant 
        // (better to not use it for high poly complex projects)
        antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;

    // Add the DOM element of the renderer to the 
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel. 
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // Set the direction of the light  
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting 
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better, 
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;

    // to activate the lights, just add them to the scene
    scene.add(shadowLight);
}

// First let's define an object :
function Cube() {
    var geom = new THREE.BoxGeometry(30, 30, 30);
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: .6,
        shading: THREE.FlatShading,
    });

    // To create an object in Three.js, we have to create a mesh 
    // which is a combination of a geometry and some material
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
}

function createCube() {
    cube = new Cube();
    scene.add(cube.mesh);
}

function createObjects() {
    createCube();
}

function loop() {
    // controls.update();

    // render the scene
    renderer.render(scene, camera);
    // call the loop function again
    requestAnimationFrame(loop);

}