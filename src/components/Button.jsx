import { motion } from 'framer-motion'

export function Button({ children, onClick, disabled, loading, variant = 'outline', size = 'md', fullWidth = true }) {
  const sm = size === 'sm'
  return (
    <motion.button
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { boxShadow:'0 0 30px rgba(255,122,0,0.65)', scale:1.015 } : {}}
      whileTap={!disabled && !loading ? { scale:0.97 } : {}}
      style={{
        fontFamily:"'Space Mono',monospace",
        fontSize: sm ? 11 : 13,
        fontWeight:700,
        letterSpacing:'0.12em',
        textTransform:'uppercase',
        border:`1px solid ${disabled ? '#303050' : '#FF7A00'}`,
        borderRadius:3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: sm ? '8px 16px' : '12px 20px',
        outline:'none',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.35 : 1,
        background: variant === 'filled'
          ? 'linear-gradient(135deg, #FF5400 0%, #FF9A00 100%)'
          : 'transparent',
        color: variant === 'filled' ? '#000' : disabled ? '#404060' : '#FF9A00',
        transition:'opacity 0.2s',
      }}
    >
      {loading
        ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <motion.span animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
              style={{ display:'inline-block', fontSize:16 }}>⟳</motion.span>
            Processing...
          </span>
        : children}
    </motion.button>
  )
}

