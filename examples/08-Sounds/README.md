# 08-Sounds

`Sounds` shows the three different ways to use sound in a kilo game.

## Setup

Run `npm i` to install dependencies.
Run `npm start` to start a dev server which will auto-reload on changes.

## What it does

There are three different sound objects created for use. The first is a plain
`Sound`, which can be played only once at a time. Calling `play()` on it during
playback will cause it to start over from the beginning.

The second sound created is a `SoundPool`. This provides multiple playable
instances of the same sound (3 by default). Because of this, a `play()` call while
the sound is already playing creates two sounds playing together.

The third option is a `SoundGroup`. It is similar to a pool, however it contains
several different sounds and randomly selects one when `play()` is called.

The game loop simply checks for specific key presses and plays the appropriate
sound type when one is detected.

