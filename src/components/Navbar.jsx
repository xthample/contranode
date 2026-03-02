import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button.jsx'
import { shortAddress } from '../utils/format.js'

export function Navbar({ connected, address, connecting, onConnect, onDisconnect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleBtn = () => connected ? setOpen(v => !v) : onConnect()

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
      background:'rgba(11,11,16,0.92)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,122,0,0.12)' }}>
      <div style={{ maxWidth:1060, margin:'0 auto', padding:'0 24px', height:64,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <motion.div
            animate={{ boxShadow:['0 0 0px transparent','0 0 16px rgba(255,122,0,0.4)','0 0 0px transparent'] }}
            transition={{ duration:2.5, repeat:Infinity }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="3" fill="#FF7A0022"/>
              <rect x="5" y="5" width="9" height="9" rx="1" fill="#FF7A00"/>
              <rect x="18" y="5" width="9" height="9" rx="1" fill="#FF9A00" opacity="0.75"/>
              <rect x="5" y="18" width="9" height="9" rx="1" fill="#FF9A00" opacity="0.75"/>
              <rect x="18" y="18" width="9" height="9" rx="1" fill="#FF5400"/>
              <line x1="9.5" y1="14" x2="9.5" y2="18" stroke="#FFB800" strokeWidth="1.5" opacity="0.6"/>
              <line x1="22.5" y1="14" x2="22.5" y2="18" stroke="#FFB800" strokeWidth="1.5" opacity="0.6"/>
              <line x1="14" y1="9.5" x2="18" y2="9.5" stroke="#FFB800" strokeWidth="1.5" opacity="0.6"/>
            </svg>
          </motion.div>
          <div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:16, fontWeight:700, letterSpacing:'0.06em', color:'#F0F0FF' }}>
              CONTRA<span style={{ color:'#FF7A00', textShadow:'0 0 14px rgba(255,122,0,0.6)' }}>NODE</span>
            </div>
            <div style={{ fontSize:8, color:'#5858A0', letterSpacing:'0.24em', fontFamily:"'Space Mono',monospace" }}>INFRASTRUCTURE LAYER</div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <AnimatePresence>
            {connected && address && (
              <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                style={{ background:'#0E0E1C', border:'1px solid #2A2A42', borderRadius:2,
                  padding:'5px 12px', display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:8, color:'#6868A0', letterSpacing:'0.16em', fontFamily:"'Space Mono',monospace" }}>NODE_ID</span>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#FFB800' }}>{shortAddress(address)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status pill */}
          <motion.div
            animate={connected ? { boxShadow:['0 0 0px transparent','0 0 14px rgba(255,122,0,0.3)','0 0 0px transparent'] } : {}}
            transition={{ duration:1.5, repeat:Infinity }}
            style={{ display:'flex', alignItems:'center', gap:7, background:'#0E0E1C',
              border:`1px solid ${connected ? 'rgba(255,122,0,0.5)' : '#1E1E30'}`, borderRadius:2, padding:'5px 12px' }}>
            <motion.div
              animate={connected ? { opacity:[1,0.2,1], scale:[1,1.4,1] } : {}}
              transition={{ duration:1.2, repeat:Infinity }}
              style={{ width:7, height:7, borderRadius:'50%', background:connected ? '#FF7A00' : '#2A2A40',
                boxShadow:connected ? '0 0 8px #FF7A00' : 'none' }}
            />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10,
              color:connected ? '#FF9A00' : '#404060', letterSpacing:'0.12em', fontWeight:700 }}>
              {connected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </motion.div>

          {/* Wallet button + dropdown */}
          <div ref={ref} style={{ position:'relative' }}>
            <Button variant={connected ? 'outline' : 'filled'} size="sm" fullWidth={false}
              onClick={handleBtn} loading={connecting} disabled={false}>
              {connected ? `${shortAddress(address)} ▾` : 'CONNECT WALLET'}
            </Button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity:0, y:-8, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:-8, scale:0.96 }}
                  transition={{ duration:0.15 }}
                  style={{ position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'#0F0F1E', border:'1px solid rgba(255,122,0,0.35)',
                    borderRadius:3, minWidth:170, overflow:'hidden',
                    boxShadow:'0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(255,122,0,0.12)', zIndex:200 }}>
                  <div style={{ padding:'10px 14px', borderBottom:'1px solid #1A1A2E' }}>
                    <div style={{ fontSize:8, color:'#6060A0', letterSpacing:'0.16em', marginBottom:5, fontFamily:"'Space Mono',monospace" }}>WALLET</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#FFB800' }}>{shortAddress(address)}</div>
                  </div>
                  <div style={{ padding:'8px 14px', borderBottom:'1px solid #1A1A2E', display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#FF7A00', boxShadow:'0 0 6px #FF7A00' }}/>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:'#FF9A00', letterSpacing:'0.1em' }}>OPNet Testnet</span>
                  </div>
                  <motion.button onClick={() => { setOpen(false); onDisconnect() }} whileHover={{ background:'rgba(255,64,64,0.1)' }}
                    style={{ width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:8, fontFamily:"'Space Mono',monospace",
                      fontSize:10, color:'#FF6060', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    <span style={{ fontSize:13 }}>⏻</span> DISCONNECT
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Animated signal line */}
      <motion.div style={{ height:2 }}
        animate={{ background:[
          'linear-gradient(90deg,transparent 0%,#FF5400 25%,#FF9A00 50%,#FF5400 75%,transparent 100%)',
          'linear-gradient(90deg,transparent 10%,#FF9A00 40%,#FFD000 60%,#FF9A00 90%,transparent 100%)',
          'linear-gradient(90deg,transparent 0%,#FF5400 25%,#FF9A00 50%,#FF5400 75%,transparent 100%)',
        ]}}
        transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
      />
    </nav>
  )
}

