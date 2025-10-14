import assert from 'node:assert/strict'
import test from 'node:test'

for (const entry of ['index.js', 'browser.js']) {
  test(`API [${entry}]`, async () => {
    const {default: styleText, stdout, stderr} = await import(`./${entry}`)

    assert.equal(styleText, stdout)
    if (entry === 'browser.js') {
      assert.equal(stdout, stderr)
    } else {
      assert.notEqual(stdout, stderr)
    }

    for (const styleText of [stdout, stderr]) {
      assert.equal(typeof styleText, 'function')
      assert.equal(typeof styleText.bold, 'function')
      assert.equal(typeof styleText.nonExists, 'function')
      assert.equal(styleText('foo'), 'foo')
    }
  })
}
