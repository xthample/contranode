import { useState, useCallback, useEffect } from "react"

export function useWallet() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  // Detect wallet injection on load
  useEffect(() => {
    if (typeof window !== "undefined" && window.opnet) {
      // Wallet injected but not connected
    }
  }, [])

  const connect = useCallback(async () => {
    if (connecting) return
    setConnecting(true)
    setError(null)

    try {
      if (!window.opnet) {
        throw new Error("OPWallet not detected. Enable extension for this site.")
      }

      // 🔥 Initialize wallet first (IMPORTANT)
      if (typeof window.opnet.initialize === "function") {
        await window.opnet.initialize()
      }

      if (typeof window.opnet.requestAccounts !== "function") {
        throw new Error("Wallet API not ready. Refresh and try again.")
      }

      const accounts = await window.opnet.requestAccounts()

      if (!accounts || !accounts.length) {
        throw new Error("No wallet account returned")
      }

      setAddress(accounts[0])
      setConnected(true)

    } catch (e) {
      console.error("Wallet connect error:", e)
      setError(e.message || "Connection failed")
      setConnected(false)
      setAddress(null)
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