import { useState, useCallback, useRef } from 'react'
import { ethers } from 'ethers'

export function useWallet() {
  const [connected,  setConnected]  = useState(false)
  const [address,    setAddress]    = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error,      setError]      = useState(null)
  const providerRef = useRef(null)

  const connect = useCallback(async () => {
    if (connecting) return
    setConnecting(true); setError(null)
    try {
      if (typeof window !== 'undefined' && window.opnet?.requestAccounts) {
        const accounts = await window.opnet.requestAccounts()
        // Build ethers provider from opnet
        providerRef.current = new ethers.BrowserProvider(window.opnet)
        setAddress(accounts[0])
      } else {
        // Demo mode
        await new Promise(r => setTimeout(r, 850))
        providerRef.current = null
        setAddress('opt1paat...a6zgg')
      }
      setConnected(true)
    } catch (e) {
      setError(e.message || 'Connection failed')
    } finally {
      setConnecting(false)
    }
  }, [connecting])

  const disconnect = useCallback(() => {
    setConnected(false); setAddress(null); setError(null)
    providerRef.current = null
  }, [])

  const getProvider = useCallback(() => providerRef.current, [])

  return { connected, address, connecting, error, connect, disconnect, getProvider }
}

