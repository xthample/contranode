import { useState, useEffect } from "react"
import { CONTRACTS } from "../config/contracts"

export function useCNODE(connected, address) {
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!connected || !address) return

    const load = async () => {
      try {
        const result = await window.opnet.request({
          method: "call",
          params: [{
            to: CONTRACTS.CNODE,
            method: "balanceOf",
            args: [address]
          }]
        })

        setBalance(Number(result) / 1e8)

      } catch (e) {
        console.error(e)
        setError(e.message)
      }
    }

    load()
  }, [connected, address])

  return { balance, error }
}