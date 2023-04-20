import { asMoneyString, formatNum, formatTime } from '@utils/formatters'

describe('asMoneyString', () => {
  it('should format value with default params', () => {
    expect(asMoneyString(42)).toBe('42.00\u00A0\u20ac')
  })

  it('should format value with given locale', () => {
    expect(asMoneyString(42, 'en-US')).toBe('\u20ac42.00')
  })

  it('should format value with given locale and currency', () => {
    expect(asMoneyString(42, 'en-US', 'USD')).toBe('\u002442.00')
  })

  it('should return empty on nullable value', () => {
    const error = new TypeError('Given value has unsupported format')
    expect(() => asMoneyString(undefined)).toThrow(error)
    expect(() => asMoneyString(null)).toThrow(error)
    expect(() => asMoneyString(NaN)).toThrow(error)
  })
})

describe('formatTime()', () => {
  const timeStr = '2020-01-02T11:22:33.444Z'
  const date = new Date(timeStr)

  it('returns time in h:m format', () => {
    expect(formatTime(new Date(timeStr), 'h:m', 'et')).toBe(`${date.getHours()}:${date.getMinutes()}`)
  })

  it('returns time in h:m:s format', () => {
    expect(formatTime(new Date(timeStr), 'h:m:s', 'et')).toBe(
      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    )
  })
})

describe('formatNum()', () => {
  it('returns num as string with divider without settings provided', () => {
    expect(formatNum(123456, undefined, undefined, 'et')).toBe('123 456')
    expect(formatNum(1)).toBe('1')
  })

  it('returns formatted num with minimumIntegerDigits 2', () => {
    expect(formatNum(1, 2, undefined, 'et')).toBe('01')
  })

  it('returns formatted num with minimumIntegerDigits 4 and minimumFractionDigits 4', () => {
    expect(formatNum(1, 4, 4, 'et')).toBe('0001,0000')
  })
})
