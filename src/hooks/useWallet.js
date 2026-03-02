import { useState, useCallback, useEffect, useRef } from "react"
import { ethers } from "ethers"

export function useWallet() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const providerRef = useRef(null)
  const signerRef = useRef(null)

  // 🔍 Auto detect injection + reconnect
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.opnet) return

    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.opnet)
        const accounts = await window.opnet.requestAccounts()

        if (accounts?.length) {
          providerRef.current = provider
          signerRef.current = await provider.getSigner()
          setAddress(accounts[0])
          setConnected(true)
        }
      } catch {
        // user belum connect, tidak masalah
      }
    }

    init()
  }, [])

  const connect = useCallback(async () => {
    if (connecting) return
    setConnecting(true)
    setError(null)

    try {
      if (!window.opnet) {
        throw new Error("OPWallet not detected. Please open extension first.")
      }

      const provider = new ethers.BrowserProvider(window.opnet)
      const accounts = await window.opnet.requestAccounts()

      providerRef.current = provider
      signerRef.current = await provider.getSigner()

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
    providerRef.current = null
    signerRef.current = null
  }, [])

  const getProvider = useCallback(() => providerRef.current, [])
  const getSigner = useCallback(() => signerRef.current, [])

  return {
    connected,
    address,
    connecting,
    error,
    connect,
    disconnect,
    getProvider,
    getSigner
  }
}
