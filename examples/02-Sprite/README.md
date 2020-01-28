# 02-Sprite

`Sprite` shows how to create and use sprites in kilo.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A new game is created with a size of 208x160 (using a tile size for
demonstration purposes).

Three textures are loaded to eventually create a banner, one each for the left,
right, and center of the banner. Then these textures are used to create arrays
of sprites.

These banner arrays are then initialized so their parts stay together in
relation to each other and added to the game.

The game update uses some simple math to move the banners around the game.

