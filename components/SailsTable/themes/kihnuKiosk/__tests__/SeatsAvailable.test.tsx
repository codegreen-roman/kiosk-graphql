import React, { ReactNode } from 'react'
import SeatsAvailable, { SeatsAvailableProps } from '../SeatsAvailable'
import { Num, Scale } from '../SeatsAvailableStyles'
import { shallow } from 'enzyme'
import { ValueLevel } from '@interfaces/boraCore'
import { getLowAvailableTicketsLevel } from '@themeSettings'

const lowAvailableTicketsLevel = getLowAvailableTicketsLevel()

describe('SeatsAvailable', () => {
  const defaultProps: SeatsAvailableProps = {
    current: 10,
    max: 20,
    local: 5,
  }
  let component

  function render(props?): ReactNode {
    const updatedProps: SeatsAvailableProps = {
      ...defaultProps,
      ...props,
    }
    return shallow(<SeatsAvailable {...updatedProps} />)
  }

  describe('when default props passed', () => {
    beforeAll(() => {
      component = render()
    })

    it('matches snapshot', () => {
      expect(component).toMatchSnapshot()
    })

    it('passes right ratio to scale component', () => {
      expect(component.find(Scale)).toHaveProp('ratio', defaultProps.current / defaultProps.max)
    })
  })

  describe('when current value is 0', () => {
    beforeAll(() => {
      component = render({ current: 0 })
    })

    it('passes LOW level prop to sub components', () => {
      expect(component.find(Num)).toHaveProp('level', ValueLevel.LOW)
      expect(component.find(Scale)).toHaveProp('level', ValueLevel.LOW)
    })
  })

  describe('when current value is lower then lowAvailableTicketsLevel theme setting', () => {
    beforeAll(() => {
      component = render({ current: defaultProps.max * lowAvailableTicketsLevel - 1 })
    })

    it('passes MIDDLE level prop to sub components', () => {
      expect(component.find(Num)).toHaveProp('level', ValueLevel.MIDDLE)
      expect(component.find(Scale)).toHaveProp('level', ValueLevel.MIDDLE)
    })
  })

  describe('when current value is lower then lowAvailableTicketsLevel theme setting', () => {
    beforeAll(() => {
      component = render({ current: defaultProps.max * lowAvailableTicketsLevel + 1 })
    })

    it('passes HIGH level prop to sub components', () => {
      expect(component.find(Num)).toHaveProp('level', ValueLevel.HIGH)
      expect(component.find(Scale)).toHaveProp('level', ValueLevel.HIGH)
    })
  })
})
