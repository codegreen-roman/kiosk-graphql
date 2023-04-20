import { DatesDiff } from '@interfaces/boraCore'
import { TimeFormatKey, TIME_FORMATS } from '@utils/formatters'

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24

export function getCurrentTime(format: TimeFormatKey, locale?: string): string {
  return new Date().toLocaleString(locale, TIME_FORMATS[format] as Intl.DateTimeFormatOptions)
}
export function getDefinedTime(time: Date, format: TimeFormatKey, locale?: string): string {
  return time.toLocaleString(locale, TIME_FORMATS[format] as Intl.DateTimeFormatOptions)
}

export function datesDiff(a: Date, b: Date): DatesDiff {
  const aUtc = a.getTime()
  const bUtc = b.getTime()
  const diff = aUtc - bUtc
  const diffAbs = Math.abs(diff)

  const days = Math.floor(diffAbs / MS_PER_DAY)
  const diffWithoutDays = diffAbs - days * MS_PER_DAY

  const hours = Math.floor(diffWithoutDays / MS_PER_HOUR)
  const diffWithoutHours = diffWithoutDays - hours * MS_PER_HOUR

  const minutes = Math.floor(diffWithoutHours / MS_PER_MINUTE)
  const diffWithoutMinutes = diffWithoutHours - minutes * MS_PER_MINUTE

  const seconds = Math.floor(diffWithoutMinutes / MS_PER_SECOND)

  return {
    isFirstDateNewer: diff > 0,
    isSecondDateNewer: diff < 0,
    isDifferent: diff !== 0,
    days,
    hours,
    minutes,
    seconds,
  }
}
