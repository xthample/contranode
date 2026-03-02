import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParticleBackground } from '../components/ParticleBackground.jsx'
import { Navbar }             from '../components/Navbar.jsx'
import { EnergyMeter }        from '../components/EnergyMeter.jsx'
import { LiquidityPanel }     from '../components/LiquidityPanel.jsx'
import { StatsPanel }         from '../components/StatsPanel.jsx'
import { Button }             from '../components/Button.jsx'
import { useWallet }          from '../hooks/useWallet.js'
import { useCNODE }           from '../hooks/useCNODE.js'
import { useLiquidity }       from '../hooks/useLiquidity.js'
import { CONTRACTS }          from '../config/contracts.js'

function Toast({ msg, type, onDone }) {
  const c = { success:'#00E5A0', error:'#FF4040', info:'#FF7A00' }[type] || '#FF7A00'
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t) }, [])
  return (
    <motion.div
      initial={{ opacity:0, y:28, x:'-50%' }}
      animate={{ opacity:1, y:0, x:'-50%' }}
      exit={{ opacity:0, y:-20, x:'-50%' }}
      style={{ position:'fixed', bottom:36, left:'50%', background:'#1A1A24',
        border:`1px solid ${c}`, borderRadius:3, padding:'12px 24px',
        fontFamily:"'Space Mono',monospace", fontSize:12, color:c,
        boxShadow:`0 0 30px ${c}50`, zIndex:9999, whiteSpace:'nowrap' }}>
      {type==='success'&&'✓  '}{type==='error'&&'✗  '}{msg}
    </motion.div>
  )
}

// Compact single-line contract address row
function ContractRow({ color, label, address }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:5, height:5, borderRadius:1, background:color, flexShrink:0 }}/>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:'#5050A0',
        letterSpacing:'0.14em', flexShrink:0, minWidth:42 }}>{label}</span>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
        color:color, opacity:0.85, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {address}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { connected, address, connecting, connect, disconnect } = useWallet()
  // Pass address so balance loads with the real wallet address
  const { balance, loading: balLd, approveCNODE, approvePILL } = useCNODE(connected, address)
  const { status: liqStatus, txHash, addLiquidity }             = useLiquidity(address)

  const [toasts, setToasts] = useState([])
  const toast = useCallback((msg, type='info') => {
    setToasts(t => [...t, { id: Date.now() + Math.random(), msg, type }])
  }, [])
  const removeToast = id => setToasts(t => t.filter(x => x.id !== id))

  useEffect(() => { if (connected)              toast('Node connected · OPNet Testnet', 'success') }, [connected])
  useEffect(() => { if (liqStatus === 'success') toast('Liquidity added successfully',   'success') }, [liqStatus])
  useEffect(() => { if (liqStatus === 'error')   toast('Transaction failed',              'error')   }, [liqStatus])

  return (
    <div style={{ minHeight:'100vh', background:'#0B0B0D', color:'#E8E8F0', overflowX:'hidden', fontFamily:"'Rajdhani',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0B0B0D}
        input::placeholder{color:#2A2A40;font-family:'Space Mono',monospace;font-size:12px}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#FF7A0040;border-radius:2px}
      `}</style>

      <ParticleBackground />
      <Navbar connected={connected} address={address} connecting={connecting} onConnect={connect} onDisconnect={disconnect} />

      <motion.main initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
        style={{ position:'relative', zIndex:2, paddingTop:86, paddingBottom:60 }}>
        <div style={{ maxWidth:960, margin:'0 auto', padding:'0 20px' }}>

          {/* Hero */}
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ textAlign:'center', marginBottom:28 }}>
            <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }} transition={{ delay:0.25, type:'spring', stiffness:200 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,122,0,0.1)',
                border:'1px solid rgba(255,122,0,0.3)', borderRadius:2, padding:'5px 14px', marginBottom:14 }}>
              <motion.div animate={{ opacity:[1,0.15,1] }} transition={{ duration:1.3, repeat:Infinity }}
                style={{ width:5, height:5, borderRadius:'50%', background:'#FF7A00', boxShadow:'0 0 6px #FF7A00' }}/>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#FF9A00', letterSpacing:'0.22em' }}>OPNet TESTNET — LIVE</span>
            </motion.div>
            <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
              style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:50, fontWeight:700, letterSpacing:'0.03em', lineHeight:1, color:'#F0F0FF' }}>
              NODE CONTROL{' '}
              <motion.span
                animate={{ textShadow:['0 0 20px rgba(255,122,0,0.4)','0 0 55px rgba(255,122,0,0.85)','0 0 20px rgba(255,122,0,0.4)'] }}
                transition={{ duration:2.5, repeat:Infinity }}
                style={{ color:'#FF7A00' }}>PANEL</motion.span>
            </motion.h1>
            <p style={{ color:'#6868A0', marginTop:10, fontSize:10, letterSpacing:'0.14em', fontFamily:"'Space Mono',monospace" }}>
              CNODE / PILL · OPNET TESTNET · LIQUIDITY INFRASTRUCTURE
            </p>
          </motion.div>

          {/* ── Compact contract strip ── */}
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}
            style={{ background:'rgba(12,12,20,0.9)', border:'1px solid #1A1A2E', borderRadius:3,
              padding:'10px 16px', marginBottom:16, backdropFilter:'blur(10px)',
              display:'flex', flexDirection:'column', gap:7 }}>
            <ContractRow color="#FF7A00" label="CNODE"  address={CONTRACTS.CNODE} />
            <div style={{ height:1, background:'#141420' }}/>
            <ContractRow color="#8B5CF6" label="PILL"   address={CONTRACTS.PILL} />
            <div style={{ height:1, background:'#141420' }}/>
            <ContractRow color="#00C87A" label="ROUTER" address={CONTRACTS.ROUTER} />
          </motion.div>

          {/* ── Dashboard card ── */}
          <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.48, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ background:'rgba(18,18,28,0.95)', border:'1px solid rgba(255,122,0,0.22)',
              borderRadius:5, boxShadow:'0 0 80px rgba(255,122,0,0.08),0 0 1px rgba(255,122,0,0.4)',
              backdropFilter:'blur(20px)', overflow:'hidden' }}>

            {/* Card header bar */}
            <div style={{ padding:'12px 22px', borderBottom:'1px solid #181828',
              background:'rgba(8,8,16,0.8)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <motion.div animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:2, repeat:Infinity }}
                  style={{ width:6, height:6, background:'#FF7A00', borderRadius:1 }}/>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#8080A8', letterSpacing:'0.18em' }}>
                  INFRASTRUCTURE DASHBOARD · v1.0.0
                </span>
              </div>
              <div style={{ display:'flex', gap:5 }}>
                {['#FF5400','#FF9A00','#00E5A0'].map((c,i) => (
                  <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:c, opacity:0.6 }}/>
                ))}
              </div>
            </div>

            <div style={{ padding:'20px 20px 18px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

                {/* Left: Energy */}
                <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.6 }}
                  style={{ background:'rgba(8,8,16,0.8)', border:'1px solid #1A1A2E',
                    borderRadius:4, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ fontSize:9, color:'#7070A0', letterSpacing:'0.22em', marginBottom:18,
                    alignSelf:'flex-start', fontFamily:"'Space Mono',monospace", fontWeight:700 }}>◈ CNODE ENERGY MODULE</div>

                  <EnergyMeter value={balance} max={500000} />

                  {/* Balance box */}
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                    style={{ marginTop:18, background:'#060610', border:'1px solid #1A1A2E',
                      borderRadius:3, padding:'13px', width:'100%', textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#5050A0', letterSpacing:'0.2em', marginBottom:7,
                      fontFamily:"'Space Mono',monospace" }}>WALLET BALANCE</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:22, color:'#FF7A00',
                      fontWeight:700, textShadow:'0 0 22px rgba(255,122,0,0.5)', minHeight:32 }}>
                      {balLd
                        ? <motion.span animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:0.9, repeat:Infinity }}
                            style={{ fontSize:12, color:'#3A3A60' }}>SYNCING...</motion.span>
                        : balance != null
                          ? balance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })
                          : <span style={{ color:'#282840', fontSize:20 }}>——</span>}
                    </div>
                    <div style={{ fontSize:9, color:'#4848A0', marginTop:5, letterSpacing:'0.14em',
                      fontFamily:"'Space Mono',monospace" }}>CNODE</div>
                  </motion.div>

                  {!connected && (
                    <div style={{ marginTop:14, width:'100%' }}>
                      <Button variant="filled" onClick={connect} loading={connecting}>INITIALIZE NODE</Button>
                    </div>
                  )}
                </motion.div>

                {/* Right: Liquidity */}
                <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.65 }}>
                  <LiquidityPanel
                    connected={connected}
                    liqStatus={liqStatus}
                    txHash={txHash}
                    onApproveCnode={approveCNODE}
                    onApprovePill={approvePILL}
                    onAddLiquidity={addLiquidity}
                    onToast={toast}
                  />
                </motion.div>
              </div>

              <StatsPanel />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }}
            style={{ marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:'#2A2A45' }}>
              CONTRANODE v1.0.0 · OPNet Testnet Infrastructure
            </span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:'#2A2A45' }}>
              {new Date().toUTCString().slice(0,22)} UTC
            </span>
          </motion.div>
        </div>
      </motion.main>

      <AnimatePresence>
        {toasts.slice(-1).map(t => (
          <Toast key={t.id} msg={t.msg} type={t.type} onDone={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

