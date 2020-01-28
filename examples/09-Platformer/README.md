# 09-Platformer

`Platformer` is the most complex example, demonstrating how to put together a
level in a game. It makes use of scenes (and scene transitions), as well as many
other features of kilo.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

This example creates a complete game level, with a bit of very simple gameplay.
It is not a full-fledged game by any means, and certainly has some buggy
behaviors.

### main.ts

The main file creates the game object and keyboard controls, then creates two
functions to set the active scene in the game.

The 'game' scene is then set, and the game is run.

### tiled-level.ts

This is an extension of the `TileMap` class whose sole purpose is to load the
player and exit game objects from the 'entities' of the Tiled map.

### game-scene.ts

This scene is where all the main game logic is kept. The constructor loads the
map information, parses it, sets up the camera, and adds some UI (the empty
diamonds in the top-left).

The camera setup is handled in a separate function, which builds the world from
map data, creates a player and pickup objects, and adds an invisible sprite for
later use.

The major work is handled in the `update` function. This is where the player is
checked for interactions with pickups, effects are used for 'juice' and game
state is checked and updated.

### game-over-scene.ts

This is a very simple scene that is set active when the player dies in the game
scene. It only displays two lines of text, and provides a way to start the game
again.

The only part that might be interesting is the fading in and out of the "GAME OVER"
text, but this has been covered in other examples.

### player.ts

All of the logic for the player is in this file. The constructor is pretty
standard setup and default values setting. Of note, the player has three
separate animations for each of the three states it can be in. The player starts
with the 'idle' animation by default.

The `addKey` function is used to show that the player has collected the key which
is needed to beat the level. The key is added as a child of the player, so it
remains in the same relative position to the player without additional effort.

As usual, the update function is where all the important work happens. Most of
the work happens in separate functions that are called to update values for the
player. Possibly the most important section is the resolver used to provide new
vectors that allow the player to handle collisions with the environment.

