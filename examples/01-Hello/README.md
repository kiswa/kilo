# 01-Hello

`Hello` shows how to create text, add it to your game, and update it as the game
runs.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A new game is created with a size of 624x480 (using a tile size for
demonstration purposes).

A text instance is created and provided with settings to create a large,
centered, off-white text.

The text is added to the game scene, and the game is run with an update function
provided inline.

Every frame, the update function is called and the text position is updated
using simple math to make it move in a circular pattern. Basic math is also used
to toggle the punctuation from `.` to `!` and back every second.

