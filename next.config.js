/* eslint-disable */
const svgoOptions = require('./svgo.conf')
const withFonts = require('nextjs-fonts')

module.exports = withFonts({
  webpack(config) {
    return {
      ...config,
      module: {
        ...config.module,
        rules: config.module.rules.concat([
          {
            test: /\.svg$/,
            issuer: /\.js$|\.jsx$|\.ts$|\.tsx$/,
            use: [
              'babel-loader',
              { loader: 'react-svg-loader', options: { svgo: svgoOptions.inlineEntries } },
              { loader: 'svgo-loader', options: svgoOptions.inlineEntries },
            ],
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
          },
        ]),
      },
    }
  },
  serverRuntimeConfig: {
    appVersion: process.env.VERSION,
  },
  publicRuntimeConfig: {
    appVersion: process.env.VERSION,
    secret: process.env.SECRET,
    graphQlUrl: process.env.GRAPHQL_URL,
    graphSubUrl: process.env.GRAPHQL_URL_WS,
    env: process.env.NODE_ENV,
    testVar: process.env.TEST_VAR,
    idleTimeout: process.env.IDLE_TIMEOUT || 30000,
    confirmationRedirectTimout:
      (process.env.CONFIRMATION_REDIRECT_TIMEOUT && parseFloat(process.env.CONFIRMATION_REDIRECT_TIMEOUT)) || 12000,
    routeHasChangedTimeout: process.env.ROUTE_CHANGED_TIMEOUT || 60000,
  },
  experimental: {
    outputStandalone: true,
  },
})
