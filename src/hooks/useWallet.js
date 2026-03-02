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
      if (!window.opnet?.web3?.provider) {
        throw new Error("OPWallet provider not found")
      }

      const accounts = await window.opnet.web3.provider.request({
        method: "eth_requestAccounts"
      })

      setAddress(accounts[0])
      setConnected(true)

    } catch (e) {
      console.error(e)
      setError(e.message || "Connection failed")
      setConnected(false)
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