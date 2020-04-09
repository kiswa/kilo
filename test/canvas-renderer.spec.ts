import { expect } from 'chai'
import { Image } from 'canvas'

import { Container, Game, Scene, Camera } from '../lib'
import { Rect, Text } from '../lib/types'
import { CanvasRenderer } from '../lib/renderer/canvas-renderer'

describe('CanvasRenderer', () => {
  const canvas = new CanvasRenderer(640, 480, document.body)
  const fast = 5

  describe('Accessors', () => {
    it('has get accessor canvasElement', () => {
      expect(canvas.canvasElement).to.be.an('HTMLCanvasElement')
    })
  })

  describe('Methods', () => {
    before(() => {
      Game.debug = true
    })

    after(() => {
      Game.debug = false
    })

    it('has method render', () => {
      expect(canvas).to.be.instanceof(CanvasRenderer)
      expect(canvas).to.have.property('render').that.is.a('function')
    })

    describe('render', () => {
      let container: any
      let entity: any

      const renderTiming = (clear = true) => {
        const start = window.performance.now()
        canvas.render(container, clear)
        const end = window.performance.now()

        return end - start
      }

      beforeEach(() => {
        container = new Container()
        entity = new Rect(10, 10)
      })

      it('exits early if nothing is visible', () => {
        container.visible = false

        const timing = (() => {
          const start = window.performance.now()
          canvas.render(container)
          const end = window.performance.now()

          return end - start
        })()

        expect(timing).to.be.below(fast)
      })

      it('renders recursively', () => {
        container.visible = true

        entity.visible = false

        container.add(entity)
        container.alpha = 1

        Game.debug = false
        expect(renderTiming(false)).to.be.below(fast)
        Game.debug = true

        entity.visible = true
        entity.children = [new Rect(5, 5)]
        entity.alpha = -1

        expect(renderTiming()).to.be.above(fast)
      })

      it('handles alpha, scale, and anchor points', () => {
        entity.visible = true
        entity.alpha = .99
        ; (entity as any).anchor = { x: 5, y: 5 }

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)

        delete (entity as any).anchor
        delete entity.scale
        delete entity.width

        expect(renderTiming()).to.be.below(fast)
      })

      it('handles rotation and pivot points', () => {
        (entity as any).rotation = 15
        ; (entity as any).pivot = { x: 5, y: 5 }

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)

        delete (entity as any).pivot

        expect(renderTiming()).to.be.below(fast)
      })

      it('handles text', () => {
        (entity as any).text = 'Testing'
        ; (entity as any).style = {
          font: 'arial',
          fill: 'red',
          align: 'center'
        }

        container.add(entity)

        expect(renderTiming()).to.be.below(9)

        ; (entity as any).style = {}

        expect(renderTiming()).to.be.below(fast)
      })

      it('handles sprites', done => {
        const img = new Image()

        img.onload = () => {
          (entity as any).texture = {
            img: img
          }

          container.add(entity)

          expect(renderTiming()).to.be.below(fast)
          done()
        }

        img.src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSO' +
          'p3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAA' +
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAA' +
          'AQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAn' +
          'QKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
      })

      it('handles sprites with frames', done => {
        const img = new Image()

        img.onload = () => {
          (entity as any).texture = {
            img: img
          }
          ; (entity as any).tileWidth = 8
          ; (entity as any).frame = { x: 0, y: 0 }

          container.add(entity)

          expect(renderTiming()).to.be.below(fast)
          done()
        }

        img.src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSO' +
          'p3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAA' +
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAA' +
          'AQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAn' +
          'QKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
      })

      it('handles drawing paths', () => {
        (entity as any).path = [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
          { x: 0, y: 5 },
        ]

        container.add(entity)
        expect(renderTiming()).to.be.below(fast)

        ; (entity as any).style = { fill: null }
        expect(renderTiming()).to.be.below(fast)

        entity.path.length = 0
        expect(renderTiming()).to.be.below(fast)
      })

      it('handles camera views', () => {
        class MyScene extends Scene {}
        const scene = new MyScene(new Game(640, 480), () => {})
        const text = new Text('Testing', {
          font: 'arial',
          fill: 'red',
          align: 'center'
        })
        const fakeSprite: any = new Rect(10, 10)
        fakeSprite.anchor = { x: 0, y: 0 }

        const camera = new Camera(fakeSprite, new Rect(10, 10))

        camera.add(text)
        scene.add(camera)
        container.add(scene)

        const child = new Rect(3, 3)
        child.pos.set(20, 20)
        camera.add(child)

        const child1 = new Rect(3, 3)
        child1.pos.set(0, 10)
        camera.add(child1)

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)
      })
    })

  })
})

