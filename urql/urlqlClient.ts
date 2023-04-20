import i18n from '../i18n/i18n'
import { subscriptionExchange, dedupExchange, cacheExchange, fetchExchange, ClientOptions, Exchange } from 'urql'
import { retryExchange } from '@urql/exchange-retry'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import getConfig from 'next/config'
import RESERVATION_ERROR from '@const/reservationErrorCodes'
import { logWithBeacon } from '@utils/logging'

const retryOptions = {
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  randomDelay: false,
  maxNumberAttempts: 3,
  retryIf: (err, operation): boolean => {
    // console.log('retryExchange', err, operation)
    const shouldRetry =
      (err && err.networkError) ||
      (err && err.graphQLErrors[0].extensions.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED)
    if (shouldRetry) logWithBeacon('NetworkRetry')
    return shouldRetry
  },
}

import { PublicConfig } from '@pages/info'

const { publicRuntimeConfig } = getConfig()
const { graphQlUrl, graphSubUrl } = publicRuntimeConfig as PublicConfig

const exchanges = [dedupExchange, cacheExchange, retryExchange(retryOptions), fetchExchange]

export const urqlClientOptions: ClientOptions = {
  url: graphQlUrl,
  fetchOptions: () => {
    let { language } = i18n

    if (language === 'fi' || language === 'de' || language === 'sv') {
      language = 'en'
    }

    return {
      headers: { 'accept-language': language },
    }
  },
  ...(typeof window !== 'undefined' && {
    exchanges: [
      ...exchanges,
      subscriptionExchange({
        forwardSubscription(operation) {
          const subscriptionClient = new SubscriptionClient(
            graphSubUrl,
            {
              reconnect: true,
            },
            window.WebSocket,
            'graphql-ws'
          )

          subscriptionClient.onConnected((): void => {
            logWithBeacon('Connected')
          })

          subscriptionClient.onConnecting((): void => {
            logWithBeacon('Connecting')
          })

          subscriptionClient.onError((): void => {
            logWithBeacon('Error')
          })

          subscriptionClient.onDisconnected((): void => {
            logWithBeacon('Disconnected')
          })

          return subscriptionClient.request(operation)
        },
      }),
    ] as Exchange[],
  }),
}
