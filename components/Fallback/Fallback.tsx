import React, { FC } from 'react'

export interface FallbackProps {
  label: string
  error: {}
}

export const Fallback: FC<FallbackProps> = ({ label, error }) => {
  console.error('label', error)
  return <div data-fallback={label} />
}
