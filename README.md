# Urosphere

A fun world in three.js to explore with my girlfriend Urvi!

## Some self notes for what's going on

- Start with building a layout, a simple world in react and three.js
- define scene + camera + renderer -> define object to render -> add to scene -> render loop
- `LESSON:` For now, AI model generation is pretty trash, so switch to free 3d models for now and get yourself some basic movements and camera positioning
- WASD for the win!
  - Added super basic model + camera movement
  - Fix camera on model and only make the model move.

- Then we move to react
- Then we move to R3F (one at a time baby!)

## Eureka on the movement part:

- Each key press will set the unit vector to 1 or -1 for the direction in an object
- we will calculate the final direction in a Vector using these keys
- this way combination of keyboard presses can give intermediate directions
