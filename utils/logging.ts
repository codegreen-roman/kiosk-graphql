export const logWithBeacon = (type: string, message = ''): void => {
  navigator.sendBeacon('/api/log', `now=${new Date().toISOString()}&type=${type}&message=${message}`)
}
