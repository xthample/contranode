import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 55 }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      vx:      (Math.random() - 0.5) * 0.35,
      vy:      (Math.random() - 0.5) * 0.35,
      size:    Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.45 + 0.08,
      phase:   Math.random() * Math.PI * 2,
    }))

    const hLines = Array.from({ length: 5 }, () => ({
      y:  Math.random() * window.innerHeight,
      vy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.15),
      op: Math.random() * 0.06 + 0.02,
    }))

    const vLines = Array.from({ length: 4 }, () => ({
      x:  Math.random() * window.innerWidth,
      vx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.4 + 0.1),
      op: Math.random() * 0.05 + 0.015,
    }))

    const streams = []
    const spawnStream = () => {
      const G = 50
      streams.push({
        x:   Math.floor(Math.random() * (canvas.width / G)) * G,
        y:   Math.random() * canvas.height,
        len: Math.random() * 180 + 60,
        alpha: 0.18,
        fade: 0,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Static grid
      ctx.strokeStyle = 'rgba(255,122,0,0.016)'
      ctx.lineWidth = 1
      const G = 50
      for (let x = 0; x <= canvas.width;  x += G) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke() }
      for (let y = 0; y <= canvas.height; y += G) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke() }

      // Moving horizontal glow lines
      hLines.forEach(l => {
        l.y += l.vy
        if (l.y < 0) l.y = canvas.height
        if (l.y > canvas.height) l.y = 0
        const g = ctx.createLinearGradient(0, 0, canvas.width, 0)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.3, `rgba(255,122,0,${l.op})`)
        g.addColorStop(0.7, `rgba(255,180,0,${l.op * 1.5})`)
        g.addColorStop(1, 'transparent')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(0, l.y); ctx.lineTo(canvas.width, l.y); ctx.stroke()
      })

      // Moving vertical glow lines
      vLines.forEach(l => {
        l.x += l.vx
        if (l.x < 0) l.x = canvas.width
        if (l.x > canvas.width) l.x = 0
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.4, `rgba(255,122,0,${l.op})`)
        g.addColorStop(0.6, `rgba(255,84,0,${l.op * 1.4})`)
        g.addColorStop(1, 'transparent')
        ctx.strokeStyle = g
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(l.x, 0); ctx.lineTo(l.x, canvas.height); ctx.stroke()
      })

      // Particles + connections
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.phase += 0.018
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        const op = p.opacity * (0.65 + 0.35 * Math.sin(p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,122,0,${op})`
        ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x
          const dy = particles[j].y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255,122,0,${(1 - dist / 110) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      // Data stream bursts
      if (Math.random() < 0.025) spawnStream()
      for (let i = streams.length - 1; i >= 0; i--) {
        const s = streams[i]
        s.fade += 0.04
        const a = s.alpha * Math.max(0, 1 - s.fade)
        if (a <= 0) { streams.splice(i, 1); continue }
        const g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.len)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.4, `rgba(255,180,0,${a})`)
        g.addColorStop(0.8, `rgba(255,84,0,${a * 0.7})`)
        g.addColorStop(1, 'transparent')
        ctx.strokeStyle = g
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + s.len); ctx.stroke()
        s.y += 1.2
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

function GlowOrbs() {
  return (
    <>
      <motion.div
        animate={{ x: [0, 70, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'fixed', top: -220, right: -120, width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,84,0,0.09) 0%, transparent 65%)', filter: 'blur(45px)', zIndex: 0, pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 70, -40, 0], scale: [1, 0.85, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        style={{ position: 'fixed', bottom: -200, left: -80, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,122,0,0.07) 0%, transparent 65%)', filter: 'blur(45px)', zIndex: 0, pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ x: [0, 35, -25, 0], y: [0, -45, 55, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
        style={{ position: 'fixed', top: '35%', left: '15%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,60,0,0.045) 0%, transparent 65%)', filter: 'blur(30px)', zIndex: 0, pointerEvents: 'none' }}
      />
    </>
  )
}

export function ParticleBackground() {
  return <><ParticleCanvas /><GlowOrbs /></>
}

