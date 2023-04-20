import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import enLocale from 'date-fns/locale/en-GB'
import etLocale from 'date-fns/locale/et'
import ruLocale from 'date-fns/locale/ru'
import fiLocale from 'date-fns/locale/fi'
import deLocale from 'date-fns/locale/de'
import svLocale from 'date-fns/locale/sv'

class RuLocalizedUtils extends DateFnsUtils {
  public getCalendarHeaderText(date): string {
    return format(date, 'LLLL yyyy', { locale: this.locale })
  }
}

export const localeUtilsMap = {
  en: DateFnsUtils,
  et: DateFnsUtils,
  ru: RuLocalizedUtils,
  fi: DateFnsUtils,
  de: DateFnsUtils,
  sv: DateFnsUtils,
}
export const localeMap = {
  en: enLocale,
  et: etLocale,
  ru: ruLocale,
  fi: fiLocale,
  de: deLocale,
  sv: svLocale,
}
export const localeFormatMap = {
  en: 'MMMM d, yyyy',
  fr: 'd MMM yyyy',
  ru: 'd MMM yyyy',
}
