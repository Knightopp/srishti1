import React, { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react'

interface AntiGravityHoverProps {
  children: React.ReactNode;
  className?: string;
  coreSize?: number;
}

export const AntiGravityHover: React.FC<AntiGravityHoverProps> = ({ children, className = '', coreSize = 48 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Use motion values to track mouse position relative to container
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth anti-gravity feel (elastic, fluid)
  const springConfig = { damping: 15, stiffness: 120, mass: 0.4 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Calculate distance from center to determine the pull
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Magnetic pull distance (amplified slightly for effect)
    mouseX.set((e.clientX - centerX) * 0.5)
    mouseY.set((e.clientY - centerY) * 0.5)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex items-center justify-center mix-blend-screen"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.4,
          rotateX: useTransform(y, [-50, 50], [25, -25]),
          rotateY: useTransform(x, [-50, 50], [-25, 25]),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* The holographic energy core cylinder */}
        <div 
          style={{ width: coreSize, height: coreSize }}
          className="rounded-full backdrop-blur-xl bg-white/10 border border-[#00f3ff]/40 shadow-[0_0_20px_rgba(0,243,255,0.6),inset_0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center relative overflow-hidden"
        >
          {/* Internal glowing core with chromatic aberration feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/60 via-purple-500/20 to-transparent blur-md rounded-full"></div>
          
          {/* Specular glass highlight */}
          <div className="absolute -top-1 left-[10%] w-[80%] h-[30%] bg-white/60 blur-[2px] rounded-full rotate-[-15deg]"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/80 blur-[1px] rounded-full"></div>
        </div>
      </motion.div>
      
      {/* Content wrapper with slight magnetic push against the core */}
      <motion.div 
        className="relative z-10"
        style={{
          x: useTransform(x, (val) => val * -0.2),
          y: useTransform(y, (val) => val * -0.2),
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
