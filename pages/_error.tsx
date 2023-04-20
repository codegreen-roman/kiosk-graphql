import React, { useEffect, useState } from 'react'

const Error: React.FC = () => {
  const [port, setPort] = useState<string>()

  useEffect(() => {
    if (window.localStorage) {
      setPort(port)
    }

    const t = setTimeout(() => {
      const port = window.localStorage.getItem('port')
      window.location.href = `${window.location.origin}/?port=${port}`
    }, 15000)

    return (): void => {
      clearTimeout(t)
    }
  }, [setPort])

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2>An unexpected error occurred</h2>
      <pre>{port}</pre>
    </div>
  )
}

export default Error
