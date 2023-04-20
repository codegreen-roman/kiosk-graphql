import { NextPageContext } from 'next'
import { buildAxiosFetch } from '@lifeomic/axios-fetch'
import axios from 'axios'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import getConfig from 'next/config'

import { PublicConfig } from '@pages/info'
const { publicRuntimeConfig } = getConfig()
const { graphQlUrl } = publicRuntimeConfig as PublicConfig

const createApolloClient = (initialState = {}, ctx: NextPageContext) => {
  const httpLink = new HttpLink({
    fetch: buildAxiosFetch(axios),
    uri: graphQlUrl,
  })

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: httpLink,
    cache: new InMemoryCache().restore(initialState),
  })
}

export default createApolloClient
