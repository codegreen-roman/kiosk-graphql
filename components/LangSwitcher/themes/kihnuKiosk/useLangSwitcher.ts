import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'urql'

import allLocalesQuery from '@gql/allLocalesQuery.graphql'
import { Locale } from '@interfaces/salesCore'
import { useTranslation } from 'react-i18next'
import { CombinedError } from '@urql/core'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'

export interface QueryAllLocalesData {
  supportedLocales: Locale[]
}

interface Result {
  activeLocale: Locale
  localeLoading: boolean
  localeLoadingError: CombinedError
  supportedLocales: Locale[]
  switchLocale: (locale: Locale) => void
}

const defaultLocale: Locale = {
  name: 'Estonian',
  preferred: true,
  shortName: 'et',
}

const defaultLocales = [
  {
    name: 'English',
    shortName: 'en',
    preferred: false,
  },
  {
    name: 'Estonian',
    shortName: 'et',
    preferred: true,
  },
  {
    name: 'Russian',
    shortName: 'ru',
    preferred: false,
  },
  {
    name: 'Finnish',
    shortName: 'fi',
    preferred: false,
  },
  {
    name: 'Swedish',
    shortName: 'sv',
    preferred: false,
  },
  {
    name: 'German',
    shortName: 'de',
    preferred: false,
  },
] as Locale[]

export function useLangSwitcher(): Result {
  const { i18n } = useTranslation()
  const [activeLocale, setActiveLocale] = useState(defaultLocale)
  const { dispatch } = useAppState()
  const [result] = useQuery<QueryAllLocalesData>({
    query: allLocalesQuery,
  })

  const { data, fetching, error } = result
  const { supportedLocales = [] } = data || { supportedLocales: defaultLocales }

  useEffect(() => {
    if (data) {
      const defaultLocale = supportedLocales
        .map((locale) => ({ ...locale, preferred: locale.shortName === i18n.language }))
        .find(({ preferred }) => preferred)

      setActiveLocale(defaultLocale)
      dispatch({ type: AppStateTypes.setPreferredLocale, payload: defaultLocale.shortName })
    }
  }, [data])

  const switchLocale = useCallback(
    (locale: Locale) => {
      if (supportedLocales.includes(locale)) {
        i18n.changeLanguage(locale.shortName).then(() => setActiveLocale(locale))
      }
    },
    [supportedLocales]
  )

  return {
    activeLocale,
    localeLoading: fetching,
    localeLoadingError: error,
    supportedLocales,
    switchLocale,
  }
}
