# Obstacles

## Observations from the game:

1. There's no obstacle in the first screen => have to wait that they appear
=> to let the player time at the beginning of the game? Or because it should start with the lowest speed and easier level?

2. obstacles have different width => give various degree of difficulty => if is wider (or taller), need to jump later, so that it doesn't land too soon

3. In the easy level, there's 2 set of obstacles at the same time, maximum (separated by half of the total width or less)

4. The speed of the whole landscape accelerates to augment the difficulty level

## Conclusions;

1. Need to control the spacing between obstacles so that there is a minimum distance, needs to implement a spacing randomness between the min (a thirs of the scrren?) and max distance (entire screen?). To add to the randomness, can not use the same method of adding objects so that the same quantity is always on the screen => should use something like a random time aöternance.