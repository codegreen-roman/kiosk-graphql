import React, { FC } from 'react'

import { BookingHeaderProps } from '@components/BookingHeader'
import { Clock } from '@components/Clock'
import { StepObject, StepsRouter } from '@components/StepsRouter'
import { Logo } from '@components/Logo'

import { Root, Container, Relative, LeftSide, LangSwitcher, LogoHolder } from './BookingHeaderStyles'
const steps: StepObject[] = [
  {
    index: 0,
    label: 'welcome',
    active: true,
    passed: true,
  },
  {
    index: 1,
    label: 'select date and route',
    active: true,
    passed: true,
  },
  {
    index: 2,
    label: 'select tickets',
    active: true,
    passed: false,
  },
  {
    index: 3,
    label: 'confirmation',
    active: false,
    passed: false,
  },
]

export const BookingHeader: FC<BookingHeaderProps> = () => {
  return (
    <Root>
      <Container maxWidth="xl">
        <Relative>
          <LeftSide>
            <LogoHolder as={Logo['kihnu-kiosk']} />
            <Clock />
          </LeftSide>

          <StepsRouter steps={steps} hideLabels />

          <LangSwitcher />
        </Relative>
      </Container>
    </Root>
  )
}
export default BookingHeader
