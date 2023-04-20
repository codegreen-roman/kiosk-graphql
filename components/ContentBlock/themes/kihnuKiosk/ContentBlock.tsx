import React, { FC } from 'react'
import { Root } from './ContentBlockStyles'
import { ContentBlockProps } from '@components/ContentBlock'

const ContentBlock: FC<ContentBlockProps> = ({ className, children, selected, disabled }) => {
  return (
    <Root className={className} selected={selected} disabled={disabled}>
      {children}
    </Root>
  )
}

export default ContentBlock
