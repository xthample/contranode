import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"
import { ROUTER_ABI } from "../abi/router"

export function useLiquidity(address) {
  const [status, setStatus] = useState("idle")
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) return

    try {
      if (!window.opnet) {
        throw new Error("Wallet missing")
      }

      setStatus("adding")

      const deadline = Math.floor(Date.now() / 1000) + 1200

      const iface = new ethers.Interface(ROUTER_ABI)

      const data = iface.encodeFunctionData("addLiquidity", [
        CONTRACTS.CNODE,
        CONTRACTS.PILL,
        ethers.parseUnits(cnodeAmt.toString(), 8),
        ethers.parseUnits(pillAmt.toString(), 8),
        0n,
        0n,
        address,
        deadline
      ])

      const txHash = await window.opnet.request({
        method: "sendTransaction",
        params: [{
          to: CONTRACTS.ROUTER,
          data
        }]
      })

      setTxHash(txHash)
      setStatus("success")

    } catch (e) {
      console.error(e)
      setError(e.message)
      setStatus("error")
    }
  }, [address])

  return { status, txHash, error, addLiquidity }
}