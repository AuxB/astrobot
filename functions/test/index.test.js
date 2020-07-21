const assert = require('assert')
const getGlobalInfo = require('../index')

describe('getGlobalInfo', () => {
  it('is a function and accepting one argument', () => {
    assert.strictEqual(typeof getGlobalInfo, 'function')
    assert.strictEqual(getGlobalInfo.length, 1)
  })
})
