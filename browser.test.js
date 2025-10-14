import assert from 'node:assert/strict'
import test from 'node:test'
import styleText from './browser.js'

test('Main [Browser]', () => {
  assert.equal(styleText.cyan.underline`hello ${'world'}`, 'hello world')
})
