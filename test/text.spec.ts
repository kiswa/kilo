import { expect } from 'chai'

import { Text } from '../lib/types'

describe('Sprite', () => {
  let text

  describe('Properties', () => {
    const style = { font: 'Arial', fill: 'red' }

    beforeEach(() => {
      text = new Text('', style)
    })

    it('has property text', () => {
      expect(text).to.have.property('text').that.equals('')
    })

    it('has property style', () => {
      expect(text).to.have.property('style').that.equals(style)
    })
  })

  describe('Methods', () => {
    const style = { font: 'Arial', fill: 'red' }

    beforeEach(() => {
      text = new Text('', style)
    })

    it('has method update', () => {
      expect(text.update).to.be.a('function')
      text.update()
    })
  })
})

