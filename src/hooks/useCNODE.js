import { useState, useEffect, useCallback } from "react"
import { CONTRACTS } from "../config/contracts.js"

export function useCNODE(connected, address) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ===== READ BALANCE =====
  useEffect(() => {
    if (!connected || !address) {
      setBalance(null)
      return
    }

    const loadBalance = async () => {
      try {
        if (!window.opnet || typeof window.opnet.call !== "function") {
          throw new Error("OPWallet not available")
        }

        setLoading(true)
        setError(null)

        const result = await window.opnet.call({
          to: CONTRACTS.CNODE,
          method: "balanceOf",
          args: [address]
        })

        // OPNet returns bigint or string
        const value = Number(result) / 1e8
        setBalance(value)

      } catch (e) {
        console.error("Balance error:", e)
        setError(e.message)
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    loadBalance()
  }, [connected, address])

  // ===== APPROVE CNODE =====
  const approveCNODE = useCallback(async (amount) => {
    if (!window.opnet || typeof window.opnet.sendTransaction !== "function") {
      throw new Error("OPWallet not available")
    }

    return await window.opnet.sendTransaction({
      to: CONTRACTS.CNODE,
      method: "approve",
      args: [
        CONTRACTS.ROUTER,
        BigInt(Math.floor(Number(amount) * 1e8))
      ]
    })
  }, [])

  // ===== APPROVE PILL =====
  const approvePILL = useCallback(async (amount) => {
    if (!window.opnet || typeof window.opnet.sendTransaction !== "function") {
      throw new Error("OPWallet not available")
    }

    return await window.opnet.sendTransaction({
      to: CONTRACTS.PILL,
      method: "approve",
      args: [
        CONTRACTS.ROUTER,
        BigInt(Math.floor(Number(amount) * 1e8))
      ]
    })
  }, [])

  return {
    balance,
    loading,
    error,
    approveCNODE,
    approvePILL
  }
}