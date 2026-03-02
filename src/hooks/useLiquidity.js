import { useCallback } from "react"
import { CONTRACTS } from "../config/contracts"
import { ROUTER_ABI } from "../abi/router"
import { ethers } from "ethers"

export function useLiquidity(address) {

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) throw new Error("Wallet not connected")

    const iface = new ethers.Interface(ROUTER_ABI)

    const calldataHex = iface.encodeFunctionData("addLiquidity", [
      CONTRACTS.CNODE,
      CONTRACTS.PILL,
      ethers.parseUnits(cnodeAmt.toString(), 8),
      ethers.parseUnits(pillAmt.toString(), 8),
      0n,
      0n,
      address,
      Math.floor(Date.now()/1000) + 1200
    ])

    const calldata = Uint8Array.from(
      Buffer.from(calldataHex.replace("0x",""), "hex")
    )

    return await window.opnet._request({
      method: "signAndBroadcastInteraction",
      params: {
        interactionParameters: {
          to: CONTRACTS.ROUTER,
          calldata,
          gasSatFee: "0",
          priorityFee: "0"
        }
      }
    })

  }, [address])

  return { addLiquidity }
}