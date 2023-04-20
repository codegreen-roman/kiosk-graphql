import { isNil, path } from 'ramda'

export const TIME_FORMATS = {
  'h:m': { hour: '2-digit', minute: '2-digit', hour12: false },
  'h:m:s': { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
}

// Intl.DateTimeFormat cheatsheet
// https://devhints.io/wip/intl-datetime

export const DATE_TIME_FORMATS = {
  'dd:mm:yyyy:hh:mm': {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h24',
  },
  'dd:mm:yy:hh:mm:long': {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h24',
  },
  'dd:mm:yy:long': {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
  },
  'dd:mm:yy': {
    day: 'numeric',
    year: 'numeric',
    month: 'numeric',
  },
}

export type TimeFormatKey = keyof typeof TIME_FORMATS
export type DateTimeFormatKey = keyof typeof DATE_TIME_FORMATS

// Default values could be replaced with values from server or global state in the future
const DEFAULT_LOCALE = 'et-EE'
const DEFAULT_CURRENCY = 'EUR'

export function asMoneyString(
  value: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY
): string {
  if (isNil(value) || isNaN(value)) {
    throw new TypeError('Given value has unsupported format')
  }
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })
  return formatter.format(value).replace(',', '.')
}

export function formatTime(date: Date, format: TimeFormatKey, locale?: string): string {
  return date.toLocaleString(locale, TIME_FORMATS[format] as Intl.DateTimeFormatOptions)
}

export function formatDate(date: Date, format: DateTimeFormatKey = 'dd:mm:yyyy:hh:mm', locale?: string): string {
  if (!locale) locale = DEFAULT_LOCALE
  return date.toLocaleString(locale, DATE_TIME_FORMATS[format] as Intl.DateTimeFormatOptions)
}
export function formatDateForQuery(date: Date): string {
  return date.toLocaleString('en-CA').split(',')[0]
  // return date.toISOString().split('T')[0]
}

export function maximumDateInArray(array: Date[]): Date {
  return new Date(Math.max.apply(null, array))
}

export function isToday(someDate: Date): boolean {
  const today = new Date()
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  )
}

export function departureDateTransform(item: string): Date {
  return new Date(new Date(item).getFullYear(), new Date(item).getMonth(), new Date(item).getDate())
}

export function formatNum(
  number: number,
  minimumIntegerDigits?: number,
  minimumFractionDigits?: number,
  locale?: string
): string {
  return Intl.NumberFormat(locale, { minimumIntegerDigits, minimumFractionDigits }).format(number)
}

export const getLeg: (i: number) => (list: string[]) => string = (index: number) => path([index])

export const sumByKey = (arr: Array<object>, key: string): number => {
  return arr.reduce((a, b) => a + (b[key] || 0), 0)
}

export const swapArrayElements = (arr: Array<string>, indexA: number, indexB: number): void => {
  const temp = arr[indexA]
  arr[indexA] = arr[indexB]
  arr[indexB] = temp
}

export const variableToString = (varObj): string => Object.keys(varObj)[0]
