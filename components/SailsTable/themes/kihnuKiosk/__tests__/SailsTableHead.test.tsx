import React, { ReactNode } from 'react'
import SailsTableHead from '../SailsTableHead'
import { shallow } from 'enzyme'

describe('SailsTableHead', () => {
  function render(): ReactNode {
    return shallow(<SailsTableHead />)
  }

  describe('when default props passed', () => {
    it('matches snapshot', () => {
      expect(render()).toMatchSnapshot()
    })
  })
})
