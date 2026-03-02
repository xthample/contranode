import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts.js"
import { ROUTER_ABI } from "../abi/router.js"

export function useLiquidity(address, getSigner) {
  const [status, setStatus] = useState("idle") 
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) {
      setError("Wallet not connected")
      return
    }

    setStatus("adding")
    setError(null)

    try {
      const signer = getSigner?.()
      if (!signer) {
        throw new Error("Signer not available. Connect wallet first.")
      }

      const router = new ethers.Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        signer
      )

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20

      const tx = await router.addLiquidity(
        CONTRACTS.CNODE,
        CONTRACTS.PILL,
        ethers.parseUnits(cnodeAmt.toString(), 8),
        ethers.parseUnits(pillAmt.toString(), 8),
        0n,
        0n,
        address,
        deadline
      )

      const receipt = await tx.wait()
      setTxHash(receipt.hash)

      setStatus("success")
      setTimeout(() => setStatus("idle"), 6000)

    } catch (e) {
      console.error("addLiquidity error:", e)
      setError(e.message || "Transaction failed")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }, [address, getSigner])

  return { status, txHash, error, addLiquidity }
}
