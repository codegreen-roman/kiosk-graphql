import { useRef, useEffect } from 'react'

export const usePreviousType = (value): string => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
