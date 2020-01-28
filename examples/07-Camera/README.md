# 07-Camera

`Camera` is the first example using a viewable world (what the camera sees)
within a larger game world.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A game is created at a size of 320x240 and keyboard controls are created. As
with the previous example, a function is created for the actual game and is
called once the JSON for the map has loaded.

This map has two 'extra' layers, just as an example for creating more detail in
a level. As with example 06, the map data is loaded (this time without an
extension class), and the size of the entire game world is computed.

A camera requires a target to follow, and this example uses a crosshair. The
camera is created with the target and dimensions of the viewable area, and the
world size.

Since the camera represents the view into the world, it is the top-level
container in the scene. The level and target are then added as children of the
camera.

This example also demonstrates the built-in features of the camera during the
inline update function of the game. After two seconds, the camera 'flashes'
white then shakes a second later.

The rest of the update function allows the crosshair to be moved with keyboard
controls, and keeps it within the game bounds.

