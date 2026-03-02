import { useState, useCallback } from "react"
import { CONTRACTS } from "../config/contracts.js"

export function useLiquidity(address) {
  const [status, setStatus] = useState("idle")
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) {
      setError("Wallet not connected")
      return
    }

    try {
      if (!window.opnet || typeof window.opnet.sendTransaction !== "function") {
        throw new Error("OPWallet not available")
      }

      setStatus("adding")
      setError(null)

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20

      const txHash = await window.opnet.sendTransaction({
        to: CONTRACTS.ROUTER,
        method: "addLiquidity",
        args: [
          CONTRACTS.CNODE,
          CONTRACTS.PILL,
          BigInt(Math.floor(Number(cnodeAmt) * 1e8)),
          BigInt(Math.floor(Number(pillAmt) * 1e8)),
          0n,
          0n,
          address,
          deadline
        ]
      })

      setTxHash(txHash)
      setStatus("success")

    } catch (e) {
      console.error("Liquidity error:", e)
      setError(e.message)
      setStatus("error")
    }
  }, [address])

  return { status, txHash, error, addLiquidity }
}