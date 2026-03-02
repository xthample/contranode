import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS } from '../config/contracts.js'
import { ROUTER_ABI } from '../abi/router.js'

const hasOpnet = () =>
  typeof window !== 'undefined' &&
  window.opnet != null &&
  typeof window.opnet.requestAccounts === 'function'

export function useLiquidity(address) {
  const [status, setStatus] = useState('idle') // idle|approving|approving-pill|adding|success|error
  const [txHash, setTxHash] = useState(null)
  const [error,  setError]  = useState(null)

  const addLiquidity = useCallback(async (cnodeAmt, pillAmt) => {
    if (!address) return
    setStatus('adding'); setError(null)
    try {
      if (hasOpnet()) {
        const provider = new ethers.BrowserProvider(window.opnet)
        const signer   = await provider.getSigner()
        const router   = new ethers.Contract(CONTRACTS.ROUTER, ROUTER_ABI, signer)
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20
        const tx = await router.addLiquidity(
          CONTRACTS.CNODE,
          CONTRACTS.PILL,
          ethers.parseUnits(cnodeAmt.toString(), 8),
          ethers.parseUnits(pillAmt.toString(), 8),
          0n, 0n, address, deadline
        )
        const receipt = await tx.wait()
        setTxHash(receipt.hash)
      } else {
        await new Promise(r => setTimeout(r, 1800))
        setTxHash('0xb9ddf84d4e27de84e30864c7c88e8b242f6ce9580f14c8807c26d6d3399f4fbd')
      }
      setStatus('success')
      setTimeout(() => setStatus('idle'), 6000)
    } catch (e) {
      console.error('addLiquidity error:', e)
      setError(e.message); setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }, [address])

  return { status, txHash, error, addLiquidity }
}

