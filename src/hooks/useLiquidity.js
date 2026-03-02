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
      if (!window.opnet?.web3?.provider) {
        throw new Error("OPWallet provider missing")
      }

      setStatus("adding")

      const provider = new ethers.BrowserProvider(
        window.opnet.web3.provider
      )

      const signer = await provider.getSigner()

      const router = new ethers.Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        signer
      )

      const deadline = Math.floor(Date.now() / 1000) + 1200

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

    } catch (e) {
      console.error(e)
      setError(e.message)
      setStatus("error")
    }
  }, [address])

  return { status, txHash, error, addLiquidity }
}