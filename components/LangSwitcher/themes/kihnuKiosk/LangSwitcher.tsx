import React, { FC, ReactElement } from 'react'

import { Icon } from '@components/Icon'
import { Fallback } from '@components/Fallback'

import { Root, Item, IconHolder } from './LangSwitcherStyles'
import { LangSwitcherProps } from '@components/LangSwitcher'
import { useLangSwitcher } from './useLangSwitcher'

const LangSwitcher: FC<LangSwitcherProps> = ({ className }) => {
  const { activeLocale, localeLoadingError, supportedLocales, switchLocale, localeLoading } = useLangSwitcher()

  if (localeLoading) {
    return <div>Loading...</div>
  }

  if (localeLoadingError) {
    return <Fallback label="langSwitcher" error={localeLoadingError} />
  }

  return (
    <Root className={className}>
      {supportedLocales.map(
        (locale): ReactElement => (
          <Item
            key={locale.shortName}
            active={locale.shortName === activeLocale?.shortName}
            onClick={(): void => switchLocale(locale)}
          >
            <IconHolder as={Icon[`lang-${locale.shortName}`]} />
          </Item>
        )
      )}
    </Root>
  )
}

export default LangSwitcher
