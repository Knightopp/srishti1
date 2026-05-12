import React from 'react'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 1 + Math.random() * 1.5,
  left: 5 + Math.random() * 90,
  top: 10 + Math.random() * 80,
  duration: 3 + Math.random() * 5,
  delay: Math.random() * 4,
}))

const GlassParticles: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-full">
    {PARTICLES.map((p) => (
      <div
        key={p.id}
        className="absolute rounded-full bg-white/20"
        style={{
          width: p.size,
          height: p.size,
          left: `${p.left}%`,
          top: `${p.top}%`,
          animation: `glass-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }}
      />
    ))}
  </div>
)

export default GlassParticles
