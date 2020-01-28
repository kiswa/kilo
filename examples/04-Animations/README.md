# 04-Animations

`Animations` shows how to create and use animations with tile-based sprites.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A new game is created with a size of 320x240, as well as a texture and two
tile sprites (both using the same texture).

The sprites then have an animation named 'walk' created for them, each with a
different animation speed. That animation is set as active with the `play`
function on the sprites animations object.

The update function moves the sprites left or right depending on their scale (an
x scale of -1 is set when moving left, which flips the sprite image). The rest
of the update function is just to keep the sprites within the game screen.
However, in comparison to example 03, this makes use of the sprites' hitbox in
addition to their position to detect collisions with the game screen edges.

