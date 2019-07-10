import { expect } from 'chai'
import { Image } from 'canvas'

import { CanvasRenderer } from '../lib/renderer/canvas-renderer'
import { Container, Game } from '../lib'
import { Rect } from '../lib/types'

describe('CanvasRenderer', () => {
  const canvas = new CanvasRenderer(640, 480, document.body)
  const fast = 5

  describe('Accessors', () => {
    it('has get accessor canvasElement', () => {
      expect(canvas.canvasElement).to.be.instanceof(HTMLCanvasElement)
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

      const renderTiming = () => {
        const start = window.performance.now()
        canvas.render(container)
        const end = window.performance.now()

        return end - start
      }

      beforeEach(() => {
        container = new Container()
        entity = new Rect(10, 10)
      })

      it('exits early if nothing is visible', () => {
        container.visible = false

        expect(renderTiming()).to.be.below(fast)
      })

      it('renders recursively', () => {
        container.visible = true

        entity.visible = false

        container.add(entity)
        container.alpha = .99

        expect(renderTiming()).to.be.above(fast)

        entity.visible = true
        entity.children = [new Rect(5, 5)]

        expect(renderTiming()).to.be.below(fast)
      })

      it('handles alpha, scale, and anchor points', () => {
        entity.visible = true
        entity.alpha = .99
        ; (entity as any).anchor = { x: 5, y: 5 }

        container.add(entity)

        expect(renderTiming()).to.be.below(fast)

        delete (entity as any).anchor
        delete entity.scale

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

        expect(renderTiming()).to.be.below(fast)

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
      })

      it('handles camera views', () => {
        (entity as any).worldSize = { x: 3, y: 3 }
        entity.width = 3
        entity.height = 3
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

