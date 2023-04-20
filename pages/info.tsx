import getConfig from 'next/config'
import React from 'react'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../urql/urlqlClient'

interface InfoPageProps {
  ip?: string
}

export type PublicConfig = {
  appVersion: string
  secret: string
  graphQlUrl: string
  graphSubUrl: string
  env: string
  idleTimeout: number
  testVar: string
  confirmationRedirectTimout: number
  routeHasChangedTimeout: number
}

const { publicRuntimeConfig } = getConfig()
const { appVersion, graphQlUrl, graphSubUrl, env, testVar, secret } = publicRuntimeConfig as PublicConfig

const InfoPage: React.FC<InfoPageProps> = ({ ip }) => {
  return (
    <div style={{ padding: '2rem', cursor: 'auto', background: 'crimson', fontSize: 'larger', color: 'whitesmoke' }}>
      <pre>version: {appVersion}</pre>
      <pre>url: {graphQlUrl}</pre>
      <pre>socket url: {graphSubUrl}</pre>
      <pre>env: {env}</pre>
      <pre>Test Var: {testVar}</pre>
      <pre>Clients ip: {ip}</pre>
      <pre>secret var: {secret}</pre>
    </div>
  )
}

export function getServerSideProps({ req }): { props: InfoPageProps } {
  return {
    props: {
      ip: req.connection.remoteAddress,
    },
  }
}

export default withUrqlClient(() => urqlClientOptions, { ssr: false })(InfoPage)
