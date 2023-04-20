import React, { FC } from 'react'
import { Root } from '@components/Text/themes/kihnuKiosk/TextStyles'
import { TextProps } from '@components/Text/TextProps'

const Text: FC<TextProps> = ({ type, customJustify, children }) => {
  return (
    <Root customJustify={customJustify} type={type}>
      {children}
    </Root>
  )
}

export default Text
