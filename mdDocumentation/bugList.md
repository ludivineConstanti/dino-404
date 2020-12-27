# Bug List

## 1st try without server

### OrbitControls.js:1 Uncaught SyntaxError: Cannot use import statement outside a module

=> Fixed by putting type="module" as the script type, in the html document.

### Access to script at 'file:///D:/Projects/_Github/dino-404/js/OrbitControls.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, brave, chrome-untrusted, https.

* CORS = Cross Origin Ressource Sharing
* For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts.
* The ressource origin is the combination of the protocol, host, and port.
=> We can solve this problem by making a server (here with express), which takes advantage of the fact that the CORS policy is only implemented in browser-to-server communication, and not in server-to-server communication.
* [3 ways to fix the CORS error](https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9)


## 2nd try with a server

### Cannot get "/"

=> Fixed by putting a "/" in front of the folder name in front of app.use(express.static(__dirname + "/static"));

#### Refused to apply style from 'http://localhost:3000/css/reset.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.

=> NAMING ISSUE The problem happened because the name reset,css was written with a coma instead of a dot, and was therefore not a valid css document.

#### GET http://localhost:3000/js/threejs/three.module.js net::ERR_ABORTED 404 (Not Found)

=> NAMING ISSUE three.module.js was in the three.js folder, not in a threejs folder

#### GET http://localhost:3000/build/three.module.js net::ERR_ABORTED 404 (Not Found)

=> Path issue in the OrbitControls file => should correct the path for three.module.js

#### Uncaught TypeError: THREE.OrbitControls is not a constructor at init (VM44 main.js:35)

=> OrbitControls is imported as such, not as THREE.OrbitControls, therefore, if we try to use properties that OrbitControls has, using the wrong name, it won't work because they do not exist.

## Making the Dino

### VM43 three.module.js:6647 THREE.Object3D.add: object not an instance of THREE.Object3D.

=> solved by changing the name of what needs to be rendered in scene.add(function.nameObjProperty);

## Making floor

#### Value doesn't behave as planned: (val) => const v = val || 200;
=> When the value is equal to 0 => chooses 200 even if a value is defined
=> Better to put like this: val = 200) => const v = val;

#### Floor borders didn't match even if they are supposed to have the same values
=> new values are generated every time a floor is created
=> need to put the values in the global scope, or clone the 1st floor