# Performance 💪

The performance is important for the animation, otherwise, the frame rate drops a lot.
Easiest thing to do, is to reduce the size of the 3D scene (so that it takes less pixels on the screen) => can make reference to the original game, which is not full screen.

Performance is based on:

1. the amount of draw / frame
2. the complexity and the size of the geometries
3. the type of materials used
4. the lights
5. the antialias
6. the amount of matrix

[Ref =>](https://codeburst.io/improve-your-threejs-performances-with-buffergeometryutils-8f97c072c14b)

## Geometry 💠

1. Creating new objects is expensive, should avoid it, cloning or recycling them is better.
2. Using BufferGeometry is cheaper than using Geometry.

### Merging geometry 🏜️

It's better to merge the geometry when possible. Instead of creating them one by one, push the geometry in an array and then use:  
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(nameOfTheArray, false);  
const material = new THREE.MeshBasicMaterial({color:'red'});  
const mesh = new THREE.Mesh(mergedGeometry, material);  
scene.add(mesh);

To do this, we need the BufferGeometryUtils  
import {BufferGeometryUtils} from './resources/threejs/r122/examples/jsm/utils/BufferGeometryUtils.js';

We can only use one color while using that method, because we're only creating one mesh, but we can fix that by using vertex colors, which adds a color per vertex.

Note => merging geometry with BufferGeometryUtils only works on buffer geometry.

[Ref =>](https://threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html)

### => OBSERVATIONS (for the stones and the cactus that are added to the floor)

#### Performance with cloning objects 🌵 🌵 🌵 ☁️ ☁️ ☁️

FPS (full screen) => between 3.4 and 5.8  
calls => between 98 and 140  
triangles => between 1950 and 2600

#### Performance with merging objects 🏜️ 🦖

FPS (full screen) => between 3.8 and 5.9  
calls => between 42 and 60  
triangles => between 2350 and 2700

### => CONCLUSION

Cloning objects reduces the geometry but augment the number of calls, seeing that the frame rate is slightly better in the version that merges objects, it seems to be the better approach. Merging objects also give the advantage of more freedom for the shape of those, since we can only tweak the properties (scale, rotation...) if we use cloning.

#### Performance with merging cubes to make a cloud and then cloning it (using the merged version for creating the floor)

FPS (full screen) => between 3.9 and 6.7   
calls => between 30 and 37  
triangles => between 2300 and 2700

## Shadows ☀️

1. Shadows are expensive, should eliminate all that are unnecessary.
2. The shadow map size (where the lights are created) should be as small as possible (and need to use the values 256, or 512, or 1024...).

## Camera 🎥

The more things are visible on the camera, the less performant it is
=> should make sure to use the minimum value for the far plane and maximum value for the near plane

## drawCalls

In renderer.info.render.calls can see the number of draw calls for a single render call. Fewer drawcalls mean better performance.

renderer.info.render gives an object with more infos

## Framerate

It's possible to check the framerate by opening the devtools and turning on the browser's frame meter (need to click on the three dots that indicate the sub-menu, on the bottom left, and then go to rendering).

## LOD (Level Of Details)

This allows us to show more or less geometry based on distance from the camera. So, just as the name say, change the level of detail, since it can be a bad idea to use high-poly mesh for something very small (far away) on the screen. Since I'm working with low-poly already, I can't optimise this further.
