const { parse } = require('./index')
const fs = require('fs')
const assert = require('assert')

describe('parse', () => {
  const data = parse(fs.readFileSync('fixture-lf.txt', 'utf8'))

  it('should parse each part headers', () => {
    assert.deepStrictEqual(data.name.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="name"' },
    ])

    assert.deepStrictEqual(data.key.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="key"' },
    ])
  })

  it('should parse a raw multipart/form-data text', () => {
    assert.strictEqual(data.name.value, 'attachment.txt')
    assert.strictEqual(data.key.value, 'data/3830719/attachment.txt')
  })
})

describe('parse crlf', () => {
  const data = parse(fs.readFileSync('fixture-crlf.txt', 'utf8'))

  it('should parse each part headers', () => {
    assert.deepStrictEqual(data.name.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="name"' },
    ])

    assert.deepStrictEqual(data.key.headers, [
      { name: 'Content-Disposition', value: 'form-data; name="key"' },
    ])
  })

  it('should parse a raw multipart/form-data text', () => {
    assert.strictEqual(data.name.value, 'attachment.txt')
    assert.strictEqual(data.key.value, 'data/3830719/attachment.txt')
  })
})
