import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { CONTRACTS } from '../config/contracts.js'
import { CNODE_ABI } from '../abi/cnode.js'

// Helper: detect if real OPNet wallet is available
const hasOpnet = () =>
  typeof window !== 'undefined' &&
  window.opnet != null &&
  typeof window.opnet.requestAccounts === 'function'

export function useCNODE(connected, address) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!connected || !address) { setBalance(null); return }
    setLoading(true); setError(null)

    const load = async () => {
      try {
        if (hasOpnet()) {
          const provider = new ethers.BrowserProvider(window.opnet)
          const contract = new ethers.Contract(CONTRACTS.CNODE, CNODE_ABI, provider)

          // Try decimals, default to 8 if fails (OPNet standard)
          let dec = 8
          try { dec = Number(await contract.decimals()) } catch {}

          const raw = await contract.balanceOf(address)
          setBalance(parseFloat(ethers.formatUnits(raw, dec)))
        } else {
          // Demo mode
          await new Promise(r => setTimeout(r, 900))
          setBalance(142857.69)
        }
      } catch (e) {
        console.error('useCNODE error:', e)
        setError(e.message)
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [connected, address])

  // Approve CNODE for router
  const approveCNODE = useCallback(async (amount) => {
    if (!hasOpnet()) {
      await new Promise(r => setTimeout(r, 1200))
      return true
    }
    const provider = new ethers.BrowserProvider(window.opnet)
    const signer   = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACTS.CNODE, CNODE_ABI, signer)
    const parsed   = ethers.parseUnits(amount.toString(), 8)
    const tx       = await contract.approve(CONTRACTS.ROUTER, parsed)
    await tx.wait()
    return true
  }, [])

  // Approve PILL for router
  const approvePILL = useCallback(async (amount) => {
    if (!hasOpnet()) {
      await new Promise(r => setTimeout(r, 1200))
      return true
    }
    const provider = new ethers.BrowserProvider(window.opnet)
    const signer   = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACTS.PILL, CNODE_ABI, signer)
    const parsed   = ethers.parseUnits(amount.toString(), 8)
    const tx       = await contract.approve(CONTRACTS.ROUTER, parsed)
    await tx.wait()
    return true
  }, [])

  return { balance, loading, error, approveCNODE, approvePILL }
}

