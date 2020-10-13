import { capitalCase, paramCase } from 'change-case'

export interface PdfImage {
  kind: 1 | 2 | 3
  data: Uint8ClampedArray
}

export function transformRgbToRgba(data) {
  const length = data.length / 3 * 4
  const result = new Uint8ClampedArray(length)
  for (let i = 0; i < data.length; i += 3) {
    const j = i / 3 * 4
    result[j + 0] = data[i + 0]
    result[j + 1] = data[i + 1]
    result[j + 2] = data[i + 2]
    result[j + 3] = 255
  }
  return result
}

export function transformGrayscaleToRgba(data) {
  const length = data.length * 4
  const result = new Uint8ClampedArray(length)
  for (let i = 0; i < data.length; i += 1) {
    const j = i * 4
    result[j + 0] = data[i]
    result[j + 1] = data[i]
    result[j + 2] = data[i]
    result[j + 3] = 255
  }
  return result
}

export function transformImageToArray(image: PdfImage): Uint8ClampedArray {
  if (image.kind === 1) {
    return transformGrayscaleToRgba(image.data)
  } else if (image.kind === 2) {
    return transformRgbToRgba(image.data)
  }
  return image.data
}

export function parseFontName(raw: string) {
  const result = { raw, identifier: '', fontFamily: raw.split('+')[1], fontWeight: 'regular', fontStyle: 'normal' }
  if (/-regular$/i.test(result.fontFamily)) {
    result.fontFamily = result.fontFamily.replace(/-regular$/i, '')
  }
  if (/-bold$/i.test(result.fontFamily)) {
    result.fontFamily = result.fontFamily.replace(/-bold$/i, '')
    result.fontWeight = 'bold'
  }
  if (/-italic$/i.test(result.fontFamily)) {
    result.fontFamily = result.fontFamily.replace(/-italic$/i, '')
    result.fontStyle = 'italic'
  }
  result.fontFamily = capitalCase(result.fontFamily)
  result.identifier = paramCase(result.fontFamily)
  return result
}
