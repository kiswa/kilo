<p style="text-align: center;">
  <img src="./logo.png">
</p>

# kilo

A simple 2D game engine library written in TypeScript.

kilo uses WebGL to render a 2D game world, but falls back to `canvas` when required.

## Examples

In the `examples` directory are several demonstrations of various things that can be done with kilo. Each has its own README to explain what it does, and the code should be useful for your own creations.

To see an example in action run `npm i` then `npm start` from within the example's directory. This starts the example (by default) on `http://localhost:9000` which you can browse to and see the example running.

## Documentation

The `docs` directory contains auto-generated documentation. It is available online at https://kiswa.github.io/kilo/.

## Library Development

### Install dependencies
```bash
npm i --python=/path/to/python2
```

### Run tests
```bash
npm test
```
### Run tests with coverage reporting
```bash
npm run test:cov
```

### Update docs
```bash
npm run docs
```


