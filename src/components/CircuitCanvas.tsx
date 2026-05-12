import React, { useRef, useEffect, useCallback } from 'react'

/* ── Types ── */
interface Point { x: number; y: number }
interface TracePath { points: Point[]; layer: 'bg' | 'fg' }
interface Pulse { pathIdx: number; t: number; speed: number; r: number }
interface Node { x: number; y: number; phase: number; freq: number; layer: 'bg' | 'fg' }

/* ── Circuit Canvas ──
   Two-layer procedural circuit traces with energy pulses and blinking nodes.
   Background layer = blurred, thick, slow parallax.
   Foreground layer = sharp, glowing, fast parallax.
*/
const CircuitCanvas: React.FC = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouse      = useRef({ x: 0.5, y: 0.5 })
  const paths      = useRef<TracePath[]>([])
  const pulses     = useRef<Pulse[]>([])
  const nodes      = useRef<Node[]>([])
  const bgOff      = useRef<HTMLCanvasElement | null>(null)
  const fgOff      = useRef<HTMLCanvasElement | null>(null)
  const raf        = useRef(0)

  /* ── Generate a PCB-like network ── */
  const generate = useCallback((w: number, h: number) => {
    const grid = 90
    const cols = Math.ceil(w / grid)
    const rows = Math.ceil(h / grid)
    const _paths: TracePath[] = []
    const _nodes: Node[] = []

    // Horizontal traces
    for (let r = 0; r < rows; r++) {
      if (Math.random() < 0.45) continue
      const y = r * grid + grid / 2
      const layer: 'bg' | 'fg' = Math.random() < 0.5 ? 'bg' : 'fg'
      const s = Math.floor(Math.random() * cols * 0.3)
      const e = Math.min(s + 2 + Math.floor(Math.random() * cols * 0.55), cols)
      const pts: Point[] = []
      for (let c = s; c <= e; c++) {
        const x = c * grid + grid / 2
        if (c > s && c < e && Math.random() < 0.18) {
          const jog = (Math.random() < 0.5 ? -1 : 1) * grid
          pts.push({ x: x - grid / 2, y })
          pts.push({ x: x - grid / 2, y: y + jog })
          pts.push({ x, y: y + jog })
          pts.push({ x, y })
          _nodes.push({ x: x - grid / 2, y, phase: Math.random() * 6.28, freq: 0.6 + Math.random() * 1.4, layer })
        } else {
          pts.push({ x, y })
        }
      }
      if (pts.length >= 2) _paths.push({ points: pts, layer })
    }

    // Vertical traces
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.55) continue
      const x = c * grid + grid / 2
      const layer: 'bg' | 'fg' = Math.random() < 0.5 ? 'bg' : 'fg'
      const s = Math.floor(Math.random() * rows * 0.3)
      const e = Math.min(s + 2 + Math.floor(Math.random() * rows * 0.45), rows)
      const pts: Point[] = []
      for (let r = s; r <= e; r++) pts.push({ x, y: r * grid + grid / 2 })
      if (pts.length >= 2) {
        _paths.push({ points: pts, layer })
        _nodes.push({ x, y: s * grid + grid / 2, phase: Math.random() * 6.28, freq: 0.5 + Math.random() * 1.5, layer })
        _nodes.push({ x, y: e * grid + grid / 2, phase: Math.random() * 6.28, freq: 0.5 + Math.random() * 1.5, layer })
      }
    }

    // Pulses
    const _pulses: Pulse[] = []
    _paths.forEach((_, i) => {
      if (Math.random() < 0.55) {
        _pulses.push({ pathIdx: i, t: Math.random(), speed: 0.0008 + Math.random() * 0.0025, r: 2 + Math.random() * 2.5 })
      }
    })

    paths.current = _paths
    nodes.current = _nodes
    pulses.current = _pulses
  }, [])

  /* ── Draw static traces to an offscreen canvas ── */
  const drawTraces = useCallback((target: HTMLCanvasElement, w: number, h: number, layer: 'bg' | 'fg') => {
    target.width = w * (window.devicePixelRatio || 1)
    target.height = h * (window.devicePixelRatio || 1)
    target.style.width = `${w}px`
    target.style.height = `${h}px`
    const ctx = target.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.scale(dpr, dpr)

    paths.current.filter(p => p.layer === layer).forEach(path => {
      if (path.points.length < 2) return
      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)
      for (let i = 1; i < path.points.length; i++) ctx.lineTo(path.points[i].x, path.points[i].y)

      if (layer === 'bg') {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.045)'
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.12)'
        ctx.lineWidth = 1
        ctx.shadowColor = 'rgba(0, 243, 255, 0.25)'
        ctx.shadowBlur = 8
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      generate(w, h)

      bgOff.current = document.createElement('canvas')
      fgOff.current = document.createElement('canvas')
      drawTraces(bgOff.current, w, h, 'bg')
      drawTraces(fgOff.current, w, h, 'fg')
    }

    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth
      mouse.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)

    let time = 0
    const loop = () => {
      time += 0.016
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const mx = (mouse.current.x - 0.5) * 2
      const my = (mouse.current.y - 0.5) * 2

      // Draw background traces (slow parallax)
      if (bgOff.current) {
        ctx.save()
        ctx.globalAlpha = 0.6
        ctx.translate(mx * -6, my * -6)
        ctx.drawImage(bgOff.current, 0, 0, w, h)
        ctx.restore()
      }

      // Draw foreground traces (faster parallax)
      if (fgOff.current) {
        ctx.save()
        ctx.globalAlpha = 1
        ctx.translate(mx * -18, my * -18)
        ctx.drawImage(fgOff.current, 0, 0, w, h)
        ctx.restore()
      }

      // Energy pulses
      pulses.current.forEach(pulse => {
        pulse.t += pulse.speed
        if (pulse.t > 1) pulse.t = 0
        const path = paths.current[pulse.pathIdx]
        if (!path || path.points.length < 2) return

        const total = path.points.length - 1
        const sf = pulse.t * total
        const si = Math.min(Math.floor(sf), total - 1)
        const sp = sf - si
        const p1 = path.points[si]
        const p2 = path.points[si + 1]
        const px = p1.x + (p2.x - p1.x) * sp
        const py = p1.y + (p2.y - p1.y) * sp

        const pm = path.layer === 'bg' ? -6 : -18
        const dx = px + mx * pm
        const dy = py + my * pm

        // Glow
        const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, pulse.r * 5)
        grad.addColorStop(0, 'rgba(0, 243, 255, 0.7)')
        grad.addColorStop(0.4, 'rgba(0, 180, 255, 0.2)')
        grad.addColorStop(1, 'rgba(0, 102, 255, 0)')
        ctx.beginPath()
        ctx.arc(dx, dy, pulse.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(dx, dy, pulse.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.fill()
      })

      // Blinking nodes
      nodes.current.forEach(node => {
        const o = 0.15 + (Math.sin(time * node.freq + node.phase) * 0.5 + 0.5) * 0.55
        const pm = node.layer === 'bg' ? -6 : -18
        const dx = node.x + mx * pm
        const dy = node.y + my * pm

        ctx.beginPath()
        ctx.arc(dx, dy, 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 243, 255, ${o * 0.25})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(dx, dy, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 243, 255, ${o})`
        ctx.fill()
      })

      raf.current = requestAnimationFrame(loop)
    }

    raf.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [generate, drawTraces])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.75 }}
    />
  )
}

export default CircuitCanvas
