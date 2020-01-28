# 06-TiledMaps

`TiledMaps` demonstrates loading a level from a Tiled export using kilo.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A function is created to initialize the game, and called after the level JSON
file is loaded.

This function first defines the 'extra' layer in the tilemap (the only required
layers are 'level' and 'entities'), then parses the map data into a TiledMap
object. That object is then used to instantiate a TiledLevel, which is an
extension class that is part of the game code.

The map is then used to create a kilo game, and added to the game's scene.

The player is then created as a TileSprite and added to the game in the location
defined in the map from Tiled (in the 'entities' layer). The 'pickups' are then
added to the game and the game is run, displaying the Tiled map with a player
and pickups on it.

