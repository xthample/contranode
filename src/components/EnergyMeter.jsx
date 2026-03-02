import { motion } from 'framer-motion'

export function EnergyMeter({ value, max = 500000 }) {
  const pct  = value ? Math.min((value / max) * 100, 100) : 0
  const R    = 66
  const circ = 2 * Math.PI * R

  return (
    <div style={{ position:'relative', width:180, height:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <motion.div
        animate={{ opacity:[0.35,0.85,0.35], scale:[0.92,1.06,0.92] }}
        transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,122,0,0.18) 0%, transparent 70%)', filter:'blur(16px)' }}
      />
      <svg width="180" height="180" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="90" cy="90" r={R} fill="none" stroke="#1C1C2E" strokeWidth="8"/>
        {/* Tick marks on track */}
        {Array.from({ length:24 }, (_,i) => {
          const angle = (i / 24) * 2 * Math.PI - Math.PI / 2
          const r1 = R - 5, r2 = R - 1
          return (
            <line key={i}
              x1={90 + r1 * Math.cos(angle)} y1={90 + r1 * Math.sin(angle)}
              x2={90 + r2 * Math.cos(angle)} y2={90 + r2 * Math.sin(angle)}
              stroke="rgba(255,122,0,0.15)" strokeWidth="1"
            />
          )
        })}
        {/* Progress arc */}
        <motion.circle cx="90" cy="90" r={R} fill="none" stroke="url(#energyGrad)"
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }}
          animate={{ strokeDashoffset:circ - (pct/100)*circ }}
          transition={{ duration:1.8, ease:'easeOut', delay:0.3 }}
          style={{ filter:'drop-shadow(0 0 14px rgba(255,154,0,1))' }}
        />
        <defs>
          <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF5400"/>
            <stop offset="60%"  stopColor="#FF9A00"/>
            <stop offset="100%" stopColor="#FFD000"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div style={{ textAlign:'center', zIndex:1, pointerEvents:'none' }}>
        <div style={{ fontSize:9, color:'#8888B8', letterSpacing:'0.2em', marginBottom:6,
          fontFamily:"'Space Mono',monospace", fontWeight:700 }}>CNODE ENERGY</div>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:21, color:'#FF9A00',
          fontWeight:700, textShadow:'0 0 24px rgba(255,154,0,0.75)' }}>
          {value ? value.toLocaleString('en-US', { maximumFractionDigits:0 }) : '——'}
        </div>
        <div style={{ fontSize:9, color:'#FF9A00', opacity:0.75, marginTop:5, fontFamily:"'Space Mono',monospace" }}>
          {pct.toFixed(1)}% CAPACITY
        </div>
      </div>
    </div>
  )
}

