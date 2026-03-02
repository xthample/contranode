import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACTS } from "../config/contracts"
import { ROUTER_ABI } from "../abi/router"

export function useLiquidity(address) {
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState(null)

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) return

    try {
      const iface = new ethers.Interface(ROUTER_ABI)

      const deadline = Math.floor(Date.now() / 1000) + 1200

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

      await window.opnet.request({
        method: "sendTransaction",
        params: [{
          to: CONTRACTS.ROUTER,
          data
        }]
      })

      setStatus("success")

    } catch (e) {
      console.error(e)
      setError(e.message)
      setStatus("error")
    }
  }, [address])

  return { status, error, addLiquidity }
}