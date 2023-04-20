import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactChildren } from 'react'
// import { ThemeProvider } from "my-ui-lib"
// import { TranslationProvider } from "my-i18n-lib"
// import defaultStrings from "i18n/en-x-default"

const Providers: Function = ({ children }): ReactChildren => {
  return children
  // return (
  //   <ThemeProvider theme="light">
  //     <TranslationProvider messages={defaultStrings}>
  //       {children}
  //     </TranslationProvider>
  //   </ThemeProvider>
  // )
}

const customRender: Function = (ui, options = {}): RenderResult =>
  render(ui, { wrapper: Providers, ...options } as RenderOptions)

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
