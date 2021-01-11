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

let shadowLight;

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
    // can not put the near plane to 0
    nearPlane = 10;
    farPlane = 400;
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

// LIGHTS **************************************************************************

const createLights = function () {
    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    // Directional lights (like all direct lights) are slow, should not use too many
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // Set the direction of the light;
    shadowLight.position.set(-150, 100, 250);

    // Allow shadow casting
    // Shadows are expensive, therefore, there's no need to allow it for every light
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 200;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 150;
    shadowLight.shadow.camera.far = 300;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;

    // put light everywhere
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // to activate the lights, just add them to the scene
    scene.add(shadowLight);
}

// MATERIALS ************************************************************************

const Colors = {
    red: new THREE.Color(0xef4239).convertSRGBToLinear(),
    blue: new THREE.Color(0x4284f7).convertSRGBToLinear(),
    green: new THREE.Color(0x31ab52).convertSRGBToLinear(),
    yellow: new THREE.Color(0xffbd08).convertSRGBToLinear(),
    white: new THREE.Color(0xffffff).convertSRGBToLinear()
};


// The Mesh Phong Material can reflect the light, unlike the Mesh Lambert material
// It's less accurate than Mesh Standard Material or Mesh Physical Material
// but performance will be better
const redMat = new THREE.MeshPhongMaterial({
    color: Colors.red,
    // change from default shininess 30
    shininess: 50,
    /*transparent: true,
    opacity: .5,*/
    shading: THREE.FlatShading,
});

const blueMat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    shininess: 50,
    // transparency => goog to see how cubes are intersecting
    /*transparent: true,
    opacity: .6,*/
    shading: THREE.FlatShading,
});

const greenMat = new THREE.MeshPhongMaterial({
    color: Colors.green,
    emissive: Colors.green,
    emissiveIntensity: 0.1,
    shininess: 100,
    shading: THREE.FlatShading,
});

const yellowMat = new THREE.MeshPhongMaterial({
    color: Colors.yellow,
    emissive: Colors.yellow,
    emissiveIntensity: 0.2,
    shininess: 50,
    shading: THREE.FlatShading,
});

const whiteMat = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shininess: 50,
    shading: THREE.FlatShading,
});

const whiteMatFloor = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shininess: 50,
    emissive: Colors.white,
    // Default is 1
    // Max value is also 1
    emissiveIntensity: 0.25,
    shading: THREE.FlatShading,
});

const multiMat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    /*transparent: true,
    opacity: .6,*/
    shading: THREE.FlatShading,
});

function assignColor(color, geom) {
    // ref => https://threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html
    // get the colors as an array of values from 0 to 255
    const rgb = color.toArray().map(v => v * 255);

    // make an array to store colors for each vertex
    const numVerts = geom.getAttribute('position').count;
    const itemSize = 3; // r, g, b
    const colors = new Uint8Array(itemSize * numVerts);

    // copy the color into the colors array for each vertex
    colors.forEach((v, ndx) => {
        colors[ndx] = rgb[ndx % 3];
    });

    const normalized = true;
    const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
    return colorAttrib;
}

export {
    createScene,
    createLights,
    scene,
    camera,
    renderer,
    redMat,
    blueMat,
    greenMat,
    yellowMat,
    whiteMat,
    whiteMatFloor,
    multiMat,
    Colors,
    assignColor
};