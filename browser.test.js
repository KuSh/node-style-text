import assert from 'node:assert/strict'
import test from 'node:test'
import styleText from './browser.js'

test('Main [Browser]', () => {
  assert.equal(
    styleText.cyan.underline`\u0020${'hello'},\u0020${'world'}\u0020`,
    ' hello, world ',
  )
})
