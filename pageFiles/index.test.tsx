// import React from 'react'
// import { render, fireEvent } from '@test/testUtils'
// import IndexPage from '@pages/index'
import 'jest-styled-components'

jest.mock('@utils/time', () => ({
  getCurrentTime: (): string => '01:00',
}))

jest.mock('next/config', () => {
  return () => ({
    publicRuntimeConfig: {
      graphQlUrl: 'https://graphql.kihnu.bora.sys/graphql',
    },
  })
})

describe.skip('Home page', () => {
  it('canary', () => {
    expect(true).toBeTruthy()
  })

  // it('matches snapshot', () => {
  //   const { asFragment } = render(<IndexPage />, {})
  //   expect(asFragment()).toMatchSnapshot()
  // })
  //
  // it.skip('clicking button triggers alert', () => {
  //   const { getByText } = render(<IndexPage />, {})
  //   window.alert = jest.fn()
  //   fireEvent.click(getByText('Test Button'))
  //   expect(window.alert).toHaveBeenCalledWith('Test Button Clicked')
  // })
})
