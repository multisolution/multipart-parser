exports.parse = function parse(raw, boundary = null) {
  if (null === boundary) {
    boundary = raw.split('\n')[0].trim()
  }

  return raw
    .split(boundary + '\n')
    .filter(empty)
    .map(part)
    .reduce(toData, {})
}

function toData(data, part) {
  const { headers, body } = part

  const key = headers
    .filter(header => header.name === 'Content-Disposition')
    .reduce((key, header) => {
      return header
        .value
        .split(';')[1]
        .trim()
        .match(/name="(.+)"/)[1]
    }, '')

  data[key] = {
    headers,
    value: body
  }

  return data
}

function part(rawPart) {
  const [rawHeaders, rawBody] = rawPart.split('\n\n')
  const headers = rawHeaders.split('\n').map(header)
  const body = rawBody

  return { headers, body }
}

function header(rawHeader) {
  const [rawName, rawValue] = rawHeader.split(':')
  const name = rawName.trim()
  const value = rawValue.trim()

  return { name, value }
}

function empty(rawPart) {
  if (rawPart.trim() === '') {
    return false
  }

  return true
}
