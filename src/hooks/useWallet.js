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
        throw new Error("OPWallet not detected")
      }

      // 🔥 WAJIB INIT
      if (typeof window.opnet.initialize === "function") {
        await window.opnet.initialize()
      }

      if (typeof window.opnet.requestAccounts !== "function") {
        throw new Error("Wallet API not ready")
      }

      const accounts = await window.opnet.requestAccounts()

      if (!accounts || !accounts.length) {
        throw new Error("No accounts returned")
      }

      setAddress(accounts[0])
      setConnected(true)

    } catch (e) {
      console.error(e)
      setError(e.message)
      setConnected(false)
      setAddress(null)
    } finally {
      setConnecting(false)
    }
  }, [connecting])

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setError(null)
  }

  return { connected, address, connecting, error, connect, disconnect }
}