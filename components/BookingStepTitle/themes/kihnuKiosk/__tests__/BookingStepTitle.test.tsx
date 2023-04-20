import React from 'react'
import { LeftSide, TotalAmount } from '../BookingStepTitleStyles'
import { shallow } from 'enzyme'

jest.mock('react-i18next', () => ({
  useTranslation: (): object => ({
    t: (): string => 'Total price label',
  }),
}))

jest.mock('../../../../../hooks/useAppState', () => ({
  useAppState: (): object => ({
    dispatch: (): void => {},
  }),
}))

import { BookingStepTitle } from '@components/BookingStepTitle'

describe('BookingStepTitle', () => {
  const component = shallow(<BookingStepTitle totalAmount={0}>Title</BookingStepTitle>)

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot()
  })

  it('renders children as left side', () => {
    expect(component.find(LeftSide)).toHaveText('Title')
  })

  it('renders right total amount with currency sign', () => {
    expect(component.find(TotalAmount)).toHaveText('0.00 €')
  })
})
