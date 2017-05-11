const T_EMPTY_STR = ''
const T_EOL = '\n'
const T_HEADER_KEYVAL = ':'
const T_HEADER_META = ';'
const T_HEADERS_BODY = '\n\n'

exports.parse = function parse(raw, boundary = null) {
  if (null === boundary) {
    boundary = raw.split(T_EOL)[0].trim()
  }

  return raw
    .split(boundary + T_EOL)
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
        .split(T_HEADER_META)[1]
        .trim()
        .match(/name="(.+)"/)[1]
    }, T_EMPTY_STR)

  data[key] = {
    headers,
    value: typeof body === 'undefined' ? '' : body.trim()
  }

  return data
}

function part(rawPart) {
  const [rawHeaders, rawBody] = rawPart.split(T_HEADERS_BODY)
  const headers = rawHeaders.split(T_EOL).filter(empty).map(header)
  const body = rawBody

  return { headers, body }
}

function header(rawHeader) {
  const [rawName, rawValue] = rawHeader.split(T_HEADER_KEYVAL)
  const name = rawName.trim()
  const value = typeof rawValue === 'undefined' ? '' : rawValue.trim()

  return { name, value }
}

function empty(rawPart) {
  if (rawPart.trim() === T_EMPTY_STR) {
    return false
  }

  return true
}
