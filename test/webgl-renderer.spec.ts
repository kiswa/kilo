import { expect } from 'chai'
import createContext from 'gl'

import { Container, Game, Camera, TileSprite, Scene } from '../lib'
import { Rect, Sprite, Texture, Text, TextOptions } from '../lib/types'
import { WebGLRenderer } from '../lib/renderer/webgl-renderer'

describe('WebGLRenderer', () => {
  const orig = document.createElement
  const fast = 3
  let glRenderer: WebGLRenderer
  const blackPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCA' +
    'QAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

  before(() => {
    const gl = createContext(640, 480)

    // Provide webgl context to canvas for tests
    ; (document.createElement as any) = (el: string) => {
      if (el === 'canvas') {
        const newEl = orig.call(document, el)

        ; (newEl as any).getContext = (ctx: string) => {
          if (ctx === 'webgl') {
            return gl
          }

          return orig.call(document, 'canvas').getContext(ctx)
        }

        return newEl
      }

      return orig.call(document, el)
    }

    glRenderer = new WebGLRenderer(640, 480, document.body)
  })

  after(() => {
    document.createElement = orig
    window.close()
  })

  describe('Methods', () => {
    before(() => {
      Game.debug = true
    })

    after(() => {
      Game.debug = false
    })

    it('has method render', () => {
      expect(glRenderer).to.be.instanceof(WebGLRenderer)
      expect(glRenderer).to.have.property('render').that.is.a('function')
    })

    describe('render', () => {
      let container: Container | Scene

      const renderTiming = (cont?: any, clear = true) => {
        const start = window.performance.now()
        glRenderer.render(cont ? cont : container, clear)
        const end = window.performance.now()

        return end - start
      }

      beforeEach(() => {
        container = new Container()
      })

      it('exits early if nothing is visible', () => {
        container.visible = false

        expect(renderTiming()).to.be.below(1)

        container.visible = true
        container.alpha = 0

        expect(renderTiming()).to.be.below(1)
      })

      it('exits early if nothing is in camera', () => {
        class MyScene extends Scene {}
        container = new MyScene(new Game(640, 480), () => {})

        const fakeSprite: any = new Rect(10, 10)
        fakeSprite.anchor = { x: 0, y: 0 }

        const camera = new Camera(fakeSprite, new Rect(10, 10))
        const entity = new Rect(3, 3)
        entity.pos.set(30, 30)

        camera.add(entity)
        container.add(camera)

        expect(renderTiming()).to.be.below(1)
      })

      it('renders recursively', () => {
        const entity = new Rect(10, 10)
        container.visible = true
        entity.visible = false

        container.add(entity)
        container.alpha = .99

        expect(renderTiming()).to.be.below(fast)

        entity.visible = true
        const one = new Rect(5, 5, { fill: 'rgba(255, 255, 255, .5)' })
        const two = new Rect(5, 5, { fill: 'ff0000' })
        const three = new Rect(5, 5, { fill: 'rgb(0, 0, 0)' })
        ; (entity as any).life = 1
        entity.children = [one, two, three]

        expect(renderTiming()).to.be.above(fast)

        const badColor = 'rgba(0, 0, 0, 0, 0)'
        const badFn = () => {
          const bad = new Rect(5, 5, { fill: badColor })
          entity.children.push(bad)

          renderTiming()
        }

        expect(badFn).to.throw(`Invalid color string ${badColor}`)
      })

      it('handles alpha, scale, and anchor points', () => {
        const entity = new Rect(10, 10)
        entity.visible = true
        entity.alpha = .99
        ; (entity as any).anchor = { x: 5, y: 5 }

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)

        delete (entity as any).anchor
        delete entity.scale
        delete container.alpha

        expect(renderTiming()).to.be.below(fast)
      })

      it('handles rotation and pivot points', () => {
        const entity = new Sprite(new Texture(blackPixel))
        entity.rotation = 15
        entity.pivot.set(5, 5)

        container.add(entity)

        expect(renderTiming()).to.be.above(fast)

        delete (entity as any).pivot

        Game.debug = false
        expect(renderTiming()).to.be.below(fast)
        Game.debug = true
      })

      it('handles text', () => {
        class MyScene extends Scene {}
        container = new MyScene(new Game(640, 480), () => {})
        const style: TextOptions = {
          font: 'arial',
          fill: 'red',
          align: 'center'
        }
        const entity = new Text('Testing', style)
        const text = new Text('asdf', style)
        const fakeSprite: any = new Rect(10, 10)
        fakeSprite.anchor = { x: 0, y: 0 }

        const camera = new Camera(fakeSprite, new Rect(10, 10))
        ; (text as any).style = {}

        camera.add(entity)
        camera.add(text)
        container.add(camera)

        expect(renderTiming()).to.be.below(fast)

        container.remove(camera)
        container.add(entity)

        expect(renderTiming()).to.be.below(fast)

        ; (container as any).game = null
        Game.debug = false
        expect(renderTiming()).to.be.below(fast)
        Game.debug = true
      })

      it('handles sprites', () => {
        const entity = new Sprite(new Texture(blackPixel))

        container.add(entity)
        container.add(entity)

        expect(renderTiming()).to.be.above(fast)

        ; (glRenderer as any).boundTexture = ''
        expect(renderTiming()).to.be.below(fast)
      })

      it('handles sprites with frames', () => {
        (Game.assets as any).isCompleted = false
        class MyScene extends Scene {
          constructor(game: Game) { super(game, () => {}) }
        }
        const img = document.createElement('img')
        const scene = new MyScene(new Game(640, 480))
        const entity = new TileSprite(new Texture(blackPixel), 8, 8)

        entity.texture.img = img

        const internalEntity = scene.add<TileSprite>(entity)

        expect(renderTiming(scene)).to.be.below(fast)

        internalEntity.frame.set(-1, -1)
        expect(renderTiming(scene, false)).to.be.below(fast)
      })

      // it('handles drawing paths', () => {
      //   (entity as any).path = [
      //     { x: 0, y: 0 },
      //     { x: 5, y: 5 },
      //     { x: 0, y: 5 },
      //   ]
      //
      //   container.add(entity)
      //
      //   expect(renderTiming()).to.be.below(fast)
      //
      //   ; (entity as any).style = { fill: null }
      //
      //   expect(renderTiming()).to.be.below(fast)
      // })

      it('handles camera views', () => {
        const sprite = new Sprite(({ img: undefined } as unknown as Texture))
        const entity = new Camera(sprite, new Rect(10, 10))
        entity.pos.set(0, 0)

        const child = new Rect(3, 3)
        child.pos.set(10, 10)
        entity.children = [child]

        const child1 = new Rect(3, 3)
        child1.pos.set(0, 10)
        entity.children.push(child1)

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)
      })
    })

  })
})

