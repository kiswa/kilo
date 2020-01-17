/// <reference path="../lib/types/tiled.ts" />
import { expect } from 'chai'

import { tiledParser } from '../lib/utils/tiled-parser'

describe('Utils - tiledParser', () => {
  it('throws if no layers found', () => {
    expect(tiledParser).to.be.a('function')

    const badFn = () => tiledParser(({} as any))
    expect(badFn).to.throw('Tiled Error: No layers found.')
  })

  it('throws if no level layer found', () => {
    expect(tiledParser).to.be.a('function')

    const badFn = () => tiledParser(({ layers: [] } as any))
    expect(badFn).to.throw('Tiled Error: Missing layer "level".')
  })

  it('throws if no entities layer found', () => {
    expect(tiledParser).to.be.a('function')

    const badFn = () => tiledParser(({ layers: [{ name: 'level' }] } as any))
    expect(badFn).to.throw('Tiled Error: Missing layer "entities".')
  })

  it('throws if no tilesets found', () => {
    expect(tiledParser).to.be.a('function')

    const badFn = () => tiledParser(({ layers: [
      { name: 'level' },
      { name: 'entities' }
    ] } as any))

    const badFn2 = () => tiledParser(({ layers: [
      { name: 'level' },
      { name: 'entities' }
    ], tilesets: [] } as any))

    expect(badFn).to.throw('Tiled Error: Missing tileset index 0.')
    expect(badFn2).to.throw('Tiled Error: Missing tileset index 0.')
  })

  it('throws if no objects in entities layer', () => {
    expect(tiledParser).to.be.a('function')

    const badFn = () => tiledParser(({ layers: [
      { name: 'level' },
      { name: 'entities' },
    ], tilesets: [{}]
    } as any))

    expect(badFn).to.throw('Tiled Error: Missing entities objects.')
  })

  it('should parse without entity properties', () => {
    expect(tiledParser).to.be.a('function')

    tiledParser({ layers: [
      { name: 'level' },
      { name: 'entities', objects: [
        { gid: 1, id: 1, x: 0, y: 0, height: 16, width: 16, name: 'test' }
      ] }
    ], tilesets: [{}]
    } as any)
  })

  it('parses a Tiled map', () => {
    const map: Tiled.Map = {
      height: 10,
      width: 10,
      tileheight: 16,
      tilewidth: 16,

      layers: [
        { name: 'bg', data: [1, 2, 3], type: 'test', opacity: 1 },
        { name: 'level', type: '', opacity: 1, data: [1, 2, 3] },
        {
          name: 'entities', type: '', opacity: 1,
          objects: [{
            gid: 1, id: 1, x: 0, y: 0, height: 16, width: 16,
            type: 'test', name: 'test', properties: [
              { name: 'test', value: 'test', type: 'test' }
            ]
          }, {
            gid: 2, id: 2, x: 0, y: 0, height: 16, width: 16,
            type: 'test', name: 'test'
          }]
        }],

      tilesets: [
        {
          columns: 10,
          firstgid: 1,
          tileheight: 16,
          tilewidth: 16,
          image: '',
          imageheight: 128,
          imagewidth: 128,
          tiles: [{
            id: 1, type: 'test', properties: [
              { name: 'prop', value: 'test', type: 'test' }
            ]
          },
          {
            id: 2, type: 'test'
          }]
        }
      ],

      properties: [],
    }

    const parsedMap = tiledParser(map, [
      { name: 'bg', isAboveLevel: false },
      { name: 'fg', isAboveLevel: true }
    ])
    expect(parsedMap).to.have.property('getObjectByName').that.is.a('function')
    expect(parsedMap).to.have.property('getObjectsByType').that.is.a('function')

    const badFn = () => parsedMap.getObjectByName('none', true)
    const badFn2 = () => parsedMap.getObjectsByType('none', true)

    expect(badFn).to.throw('Tiled Error: Missing named object "none".')
    expect(badFn2).to.throw('Tiled Error: Missing an object of type "none".')

    const testObj = parsedMap.getObjectByName('test')
    expect(testObj.x).to.equal(0)
    expect(testObj.y).to.equal(0)

    const testObjs = parsedMap.getObjectsByType('test')
    expect(testObjs.length).to.equal(2)
    expect(testObjs[0].x).to.equal(testObj.x)
    expect(testObjs[0].y).to.equal(testObj.y)
  })
})

