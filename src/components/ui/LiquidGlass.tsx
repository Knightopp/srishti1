import React from 'react'
import { motion, HTMLMotionProps } from 'motion/react'

interface LiquidGlassProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  intensity?: 'light' | 'medium' | 'heavy'
  shape?: 'rounded' | 'pill'
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  shape = 'rounded',
  ...props 
}) => {
  const blurMap = {
    light: 'backdrop-blur-md bg-white/5 border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.2)]',
    medium: 'backdrop-blur-xl bg-[#00f3ff]/5 border-[#00f3ff]/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,243,255,0.1)]',
    heavy: 'backdrop-blur-3xl bg-[#00f3ff]/10 border-[#00f3ff]/30 shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_12px_48px_rgba(0,243,255,0.15)]'
  }

  const shapeMap = {
    rounded: 'rounded-3xl',
    pill: 'rounded-full'
  }

  return (
    <motion.div
      className={`relative overflow-hidden border ${blurMap[intensity]} ${shapeMap[shape]} ${className}`}
      {...props}
    >
      {/* Volumetric ambient light scattered inside the glass */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#00f3ff]/10 via-transparent to-transparent mix-blend-screen pointer-events-none"></div>
      
      {/* Top reflection rim */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  )
}
