import React, { ReactElement } from 'react'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/styles'
import { ServerStyleSheet as StyledServerStyleSheets } from 'styled-components'
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles'

const theme = responsiveFontSizes(createTheme())
class MyDocument extends Document {
  public render(): ReactElement {
    return (
      <Html lang="et">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Render app and page and get the context of the page with collected side effects.
  const materialUiSheets = new ServerStyleSheets()
  const styledSheet = new StyledServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  const enhanceApp = (App) => (props) => styledSheet.collectStyles(materialUiSheets.collect(<App {...props} />))

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp,
      })

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          {materialUiSheets.getStyleElement()}
          {styledSheet.getStyleElement()}
        </React.Fragment>,
      ],
    }
  } finally {
    styledSheet.seal()
  }
}

export default MyDocument
