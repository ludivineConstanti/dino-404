# Performance

The performance is important for the animation, otherwise, the frame rate drops a lot.
Easiest thing to do, is to reduce the size of the 3D scene (so that it takes less pixels on the screen) => can make reference to the original game, which is not full screen.

## Geometry

1. Creating new objects is expensive, should avoid it, cloning or recycling them is better. 
2. Using BufferGeometry is cheaper than using Geometry.

## Shadows

1. Shadows are expensive, should eliminate all that are unnecessary.
2. The shadow map size (where the lights are created) should be as small as possible (and need to use the values 256, or 512, or 1024...).

## Camera

The more things are visible on the camera, the less performant it is
=> should make sure to use the minimum value for the far plane and maximum value for the near plane