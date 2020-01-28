# 05-Scenes

`Scenes` shows how to create and use multiple scenes in a game.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

A new game is created with a size of 320x240, then two functions are created to
allow the two scenes to transition back and forth. The first scene is set as the
active scene and the game is run without an inline update function.

The first scene creates a text object and adds it to itself. During its update
function, it keeps track of how long it's been active and calls the provided
function when two-and-a-half seconds have passed (moving to the second scene).

The second scene has different text and updates it to move around. It also keeps
track of how long it's been active, and calls the scene complete function after
five seconds (returning to the first scene).

