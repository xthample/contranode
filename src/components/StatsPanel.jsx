import { useRef, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

function AnimatedNumber({ value, decimals = 2 }) {
  const ref = useRef(null)
  const mv  = useMotionValue(0)
  useEffect(() => {
    if (value == null) return
    const ctrl = animate(mv, value, {
      duration:1.6, ease:[0.25,0.1,0.25,1],
      onUpdate: v => { if (ref.current) ref.current.textContent = v.toLocaleString('en-US',
        { minimumFractionDigits:decimals, maximumFractionDigits:decimals }) },
    })
    return () => ctrl.stop()
  }, [value])
  return <span ref={ref}>0</span>
}

export function StatsPanel() {
  const stats = [
    { label:'CNODE PRICE', value:0.0042,  decimals:4 },
    { label:'POOL TVL',    value:1840220, decimals:0 },
    { label:'MARKET CAP', value:8291000, decimals:0 },
  ]
  return (
    <div>
      <div style={{ fontSize:9, color:'#8080A8', letterSpacing:'0.22em', marginBottom:12,
        fontFamily:"'Space Mono',monospace", fontWeight:700 }}>◈ LIVE MARKET METRICS</div>
      <div style={{ display:'flex', gap:12 }}>
        {stats.map(({ label, value, decimals }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.8 + i*0.1 }}
            style={{ background:'rgba(10,10,18,0.8)', border:'1px solid #202035',
              borderRadius:4, padding:'16px 18px', flex:1 }}>
            <div style={{ fontSize:9, color:'#7070A0', letterSpacing:'0.18em', marginBottom:10,
              fontFamily:"'Space Mono',monospace", fontWeight:700 }}>{label}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:22, color:'#FF7A00',
              fontWeight:700, textShadow:'0 0 18px rgba(255,122,0,0.45)' }}>
              $<AnimatedNumber value={value} decimals={decimals}/>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

