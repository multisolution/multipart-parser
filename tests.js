const { parse } = require('./index')
const fs = require('fs')
const assert = require('assert')

describe('parse', () => {
  const data = parse(fs.readFileSync('fixture.txt', 'utf8'))

  it('should parse each part headers', () => {
    assert.deepStrictEqual(data.foo.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="foo"' },
      { name: 'X-Foo', value: 'foo' }
    ])

    assert.deepStrictEqual(data.bar.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="bar"' },
      { name: 'X-Bar', value: 'bar' }
    ])
  })

  it('should parse a raw multipart/form-data text', () => {
    assert.strictEqual(data.foo.value, 'Foo Body')
    assert.strictEqual(data.bar.value, 'Bar Body')
  })
})
