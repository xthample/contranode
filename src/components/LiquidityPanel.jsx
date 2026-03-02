import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button.jsx'
import { CONTRACTS } from '../config/contracts.js'

function NodeInput({ label, value, onChange, placeholder, badge }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
        <div style={{ fontSize:9, color:'#8888B0', letterSpacing:'0.18em',
          fontFamily:"'Space Mono',monospace", fontWeight:700 }}>{label}</div>
        {badge && (
          <div style={{ display:'flex', alignItems:'center', gap:5,
            background: badge.bg || 'rgba(255,122,0,0.1)',
            border: badge.border || '1px solid rgba(255,122,0,0.25)',
            borderRadius:2, padding:'2px 8px' }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9,
              color: badge.color || '#FF9A00', fontWeight:700 }}>
              {badge.symbol}
            </span>
          </div>
        )}
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', background:'#06060F',
          border:`1px solid ${focused ? '#FF7A00' : '#1E1E35'}`,
          borderRadius:3, padding:'11px 14px', color:'#FFD080',
          fontFamily:"'Space Mono',monospace", fontSize:14, outline:'none',
          boxSizing:'border-box',
          boxShadow: focused ? '0 0 18px rgba(255,122,0,0.2),inset 0 0 8px rgba(255,122,0,0.04)' : 'none',
          transition:'all 0.2s' }}
      />
    </div>
  )
}

function TokenPairBadge() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16,
      background:'rgba(255,255,255,0.03)', border:'1px solid #1E1E35',
      borderRadius:3, padding:'10px 14px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:26, height:26, borderRadius:'50%',
          background:'linear-gradient(135deg,#FF5400,#FF9A00)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 8px rgba(255,122,0,0.4)', flexShrink:0 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#000', fontFamily:'monospace' }}>C</span>
        </div>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#FFB800', fontWeight:700, lineHeight:1 }}>CNODE</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:'#5050A0', marginTop:2 }}>ContraNode</div>
        </div>
      </div>

      <motion.div animate={{ x:[-2,2,-2] }} transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
        style={{ flex:1, textAlign:'center', color:'#FF7A00', fontSize:14 }}>⇄</motion.div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:26, height:26, borderRadius:'50%',
          background:'linear-gradient(135deg,#7C3AED,#DB2777)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 8px rgba(139,92,246,0.4)', flexShrink:0 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#fff', fontFamily:'monospace' }}>P</span>
        </div>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#C084FC', fontWeight:700, lineHeight:1 }}>PILL</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:'#5050A0', marginTop:2 }}>Orange Pill</div>
        </div>
      </div>
    </div>
  )
}

function StepBar({ step, liqStatus }) {
  const done3 = liqStatus === 'success'
  const steps = [
    { label:'APPROVE CNODE', done: step >= 1 },
    { label:'APPROVE PILL',  done: step >= 2 },
    { label:'ADD LIQUIDITY', done: done3       },
  ]
  return (
    <div style={{ display:'flex', gap:6, marginBottom:16 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex:1 }}>
          <div style={{ height:2, background: s.done ? '#FF7A00' : '#1A1A30', borderRadius:1, marginBottom:4,
            boxShadow: s.done ? '0 0 6px rgba(255,122,0,0.5)' : 'none', transition:'all 0.3s' }}/>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, letterSpacing:'0.08em',
            color: s.done ? '#FF9A00' : '#404060', textAlign:'center' }}>
            {s.done ? '✓' : `${i+1}`}. {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function LiquidityPanel({ connected, liqStatus, txHash, onApproveCnode, onApprovePill, onAddLiquidity, onToast }) {
  const [cnode, setCnode]   = useState('')
  const [pill,  setPill]    = useState('')
  const [step,  setStep]    = useState(0)
  const [busy,  setBusy]    = useState(null) // null | 'cnode' | 'pill' | 'liq'

  const handleApproveCnode = async () => {
    if (!cnode || isNaN(cnode) || Number(cnode) <= 0) return onToast('Enter valid CNODE amount', 'error')
    setBusy('cnode')
    try {
      const ok = await onApproveCnode(cnode)
      if (ok) { setStep(1); onToast('CNODE approved ✓', 'success') }
      else onToast('CNODE approval failed', 'error')
    } catch(e) { onToast(e.message || 'Error', 'error') }
    finally { setBusy(null) }
  }

  const handleApprovePill = async () => {
    if (!pill || isNaN(pill) || Number(pill) <= 0) return onToast('Enter valid PILL amount', 'error')
    setBusy('pill')
    try {
      const ok = await onApprovePill(pill)
      if (ok) { setStep(2); onToast('PILL approved ✓', 'success') }
      else onToast('PILL approval failed', 'error')
    } catch(e) { onToast(e.message || 'Error', 'error') }
    finally { setBusy(null) }
  }

  const handleAddLiq = async () => {
    if (!cnode || !pill) return onToast('Fill both amounts', 'error')
    setBusy('liq')
    try {
      await onAddLiquidity(cnode, pill)
    } catch(e) { onToast(e.message || 'Error', 'error') }
    finally { setBusy(null) }
  }

  return (
    <div style={{ background:'rgba(10,10,18,0.8)', border:'1px solid #1E1E35',
      borderRadius:4, padding:'20px', height:'100%' }}>
      <div style={{ fontSize:9, color:'#8080A8', letterSpacing:'0.22em', marginBottom:16,
        fontFamily:"'Space Mono',monospace", fontWeight:700 }}>◈ LIQUIDITY CONTROL MODULE</div>

      <TokenPairBadge />
      <StepBar step={step} liqStatus={liqStatus} />

      <NodeInput label="CNODE AMOUNT" value={cnode} onChange={setCnode} placeholder="0.00000000"
        badge={{ symbol:'◈ CNODE', color:'#FF9A00', bg:'rgba(255,122,0,0.1)', border:'1px solid rgba(255,122,0,0.25)' }}/>

      <NodeInput label="PILL AMOUNT" value={pill} onChange={setPill} placeholder="0.00000000"
        badge={{ symbol:'◉ PILL', color:'#C084FC', bg:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)' }}/>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
        {/* Step 1 */}
        <Button onClick={handleApproveCnode} disabled={!connected || step >= 1} loading={busy === 'cnode'}>
          {step >= 1 ? '✓ CNODE APPROVED' : '1. APPROVE CNODE'}
        </Button>

        {/* Step 2 */}
        <Button onClick={handleApprovePill} disabled={!connected || step < 1 || step >= 2} loading={busy === 'pill'}>
          {step >= 2 ? '✓ PILL APPROVED' : '2. APPROVE PILL'}
        </Button>

        {/* Step 3 */}
        <Button variant="filled" onClick={handleAddLiq}
          disabled={!connected || step < 2 || liqStatus === 'adding'} loading={busy === 'liq' || liqStatus === 'adding'}>
          3. ADD LIQUIDITY
        </Button>
      </div>

      {/* Success */}
      <AnimatePresence>
        {liqStatus === 'success' && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} style={{ marginTop:12 }}>
            <motion.div
              animate={{ boxShadow:['0 0 0px transparent','0 0 16px rgba(0,229,160,0.3)','0 0 0px transparent'] }}
              transition={{ duration:1.5, repeat:Infinity }}
              style={{ background:'rgba(0,229,160,0.07)', border:'1px solid rgba(0,229,160,0.28)',
                borderRadius:3, padding:'11px 14px', fontFamily:"'Space Mono',monospace",
                fontSize:11, color:'#00E5A0', fontWeight:700 }}>
              ✓ LIQUIDITY ADDED
              {txHash && (
                <div style={{ opacity:0.5, marginTop:4, fontSize:9, fontWeight:400,
                  wordBreak:'break-all', lineHeight:1.6 }}>
                  {txHash.slice(0,22)}...{txHash.slice(-8)}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact info */}
      <div style={{ marginTop:16, paddingTop:12, borderTop:'1px solid #151525' }}>
        {[
          ['PROTOCOL', 'window.opnet',                                          '#FF7A00'],
          ['NETWORK',  CONTRACTS.NETWORK,                                       '#FF9A00'],
          ['ROUTER',   `${CONTRACTS.ROUTER.slice(0,8)}...${CONTRACTS.ROUTER.slice(-6)}`, '#5A5A80'],
          ['PAIR',     'CNODE / PILL',                                          '#9090C0'],
        ].map(([k, v, c]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:8, color:'#404060', letterSpacing:'0.14em', fontFamily:"'Space Mono',monospace" }}>{k}</span>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:c, fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

