# 03-Controls

`Controls` shows how to create and use both keyboard and mouse controls in your
game.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A new game is created with a size of 416x416 (using a tile size for
demonstration purposes).

A sprite is created, as well as controls to allow the sprite to be moved by a
player. The sprite is added to the game, and the inline update method handles
the rest.

During an update, the x and y values from keyboard controls (if any) are added
to the position of the sprite (with modifications by the delta time and a pre-
defined speed). The mouse controls are then used to check if the mouse button
is down, and if so, move the sprite toward the mouse pointer with the help of a
few utility methods provided by kilo.

The last part of an update ensures the sprite doesn't leave the bounds of the
game screen (the values are non-zero because of offsets from the edge of the
sprite to the actual visible portion).

