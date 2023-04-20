import ContentBlock from './ContentBlock'
import React from 'react'
import { render } from '@test/testUtils'
import 'jest-styled-components'
import { RenderResult } from '@testing-library/react'

describe('ContentBlock', () => {
  function renderComponent(): RenderResult {
    return render(
      <ContentBlock className="test" selected disabled>
        123
      </ContentBlock>
    )
  }

  it('renders correctly', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot()
  })
})
