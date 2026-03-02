import { useState, useCallback } from "react"

export function useWallet() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const connect = useCallback(async () => {
    if (connecting) return
    setConnecting(true)
    setError(null)

    try {
      if (!window.opnet) {
        throw new Error("OPWallet not detected. Click extension first.")
      }

      const accounts = await window.opnet.requestAccounts()

      setAddress(accounts[0])
      setConnected(true)

    } catch (e) {
      setError(e.message || "Connection failed")
      setConnected(false)
    } finally {
      setConnecting(false)
    }
  }, [connecting])

  const disconnect = useCallback(() => {
    setConnected(false)
    setAddress(null)
    setError(null)
  }, [])

  return {
    connected,
    address,
    connecting,
    error,
    connect,
    disconnect
  }
}