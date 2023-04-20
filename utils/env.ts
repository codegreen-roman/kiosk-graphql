import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'

const { publicRuntimeConfig } = getConfig()

export function isTestEnv(): boolean {
  return process?.env?.NODE_ENV === 'test'
}

export function isProductionEnv(): boolean {
  const { env } = publicRuntimeConfig as PublicConfig
  return env === 'prod' || env === 'production'
}
