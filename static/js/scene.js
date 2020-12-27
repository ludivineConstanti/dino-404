import * as THREE from "/js/three.js/three.module.js";

let scene,
    camera,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    HEIGHT,
    WIDTH,
    renderer,
    container;

const createScene = function () {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // fog helps with the transition for the end of the ground
    // color, near, far => depends on the camera
    scene.fog = new THREE.Fog(0xffffff, 140, 500);

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
        antialias: true,
    });

    // Change the colors => suppose to make it more accurate
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Make the lights accurate
    // Default is false for backward compatibility
    // Useful mainly when we want to re-use real life light settings
    // Can potentially be a problem if there's no environment
    // (real life gets a lot of reflected light from environments, not only light sources)
    // => Need indirect lighting
    // Ambient light is three.js solution to fake indirect lighting (too much calculations, otherwise)
    // Need to adjust the lights to use it (currently is too dark)
    // ref: https://discoverthreejs.com/book/first-steps/physically-based-rendering/
    // renderer.physicallyCorrectLights = true;

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;

    // Add the DOM element of the renderer to the
    // container we created in the HTML
    container = document.getElementById("world");
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// MATERIALS ************************************************************************

const Colors = {
    red: new THREE.Color(0xef4239),
    blue: new THREE.Color(0x4284f7),
    green: new THREE.Color(0x31ab52),
    yellow: new THREE.Color(0xffbd08),
    white: new THREE.Color(0xffffff),
};

// Give more accurate colors
Colors.red.convertSRGBToLinear();
Colors.blue.convertSRGBToLinear();
Colors.white.convertSRGBToLinear();

// The Mesh Phong Material can reflect the light, unlike the Mesh Lambert material
// It's less accurate than Mesh Standard Material or Mesh Physical Material
// but performance will be better
const redMat = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading,
});

const blueMat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    // transparency => goog to see how cubes are intersecting
    /*transparent: true,
    opacity: .6,*/
    shading: THREE.FlatShading,
});

const whiteMat = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.FlatShading,
});

// change from default shininess 30
redMat.shininess = 50;
blueMat.shininess = 50;
whiteMat.shininess = 50;

export {
    createScene,
    scene,
    camera,
    renderer,
    redMat,
    blueMat,
    whiteMat
};