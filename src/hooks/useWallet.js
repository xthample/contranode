import { useState, useCallback } from "react"

export function useWallet() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [error, setError] = useState(null)
  const [connecting, setConnecting] = useState(false)

  const connect = useCallback(async () => {
    if (connecting) return
    setConnecting(true)
    setError(null)

    try {
      if (!window.opnet) {
        throw new Error("OPWallet not injected")
      }

      if (typeof window.opnet.initialize === "function") {
        await window.opnet.initialize()
      }

      const accounts = await window.opnet.requestAccounts()

      setAddress(accounts[0])
      setConnected(true)

    } catch (e) {
      console.error(e)
      setError(e.message)
      setConnected(false)
    } finally {
      setConnecting(false)
    }
  }, [connecting])

  return { connected, address, error, connect }
}