import React, { ReactElement, FC } from 'react'
import styled from 'styled-components'
import { LogoProps } from '@components/Logo'

import KihnuKioskLogoSvg from './assets/logo.svg'

export const LogoHolder = styled.div`
  display: block;
  line-height: 0;
`

function wrapSvg(Logo): FC<LogoProps> {
  return ({ className }): ReactElement => (
    <LogoHolder className={className}>
      <Logo />
    </LogoHolder>
  )
}

const Logo = {
  'kihnu-kiosk': wrapSvg(KihnuKioskLogoSvg),
}

export default Logo
