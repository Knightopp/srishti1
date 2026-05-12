import React, { useState, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { LiquidGlass } from './ui/LiquidGlass'

interface AppleButtonProps {
  label?: string
  full?: boolean
  onClick?: () => void
}

const AppleButton: React.FC<AppleButtonProps> = ({
  label = 'Download Aura',
  full = false,
  onClick,
}) => {
  const [burst, setBurst] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const handleClick = () => {
    onClick?.()
    setBurst(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setBurst(false), 700)
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full text-white font-medium text-sm px-8 py-3.5 transition-all active:scale-[0.98] font-ui ${
        full ? 'w-full' : ''
      }`}
    >
      {/* Base state */}
      <LiquidGlass
        shape="pill"
        intensity="medium"
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
      />

      {/* Hover outer glass */}
      <LiquidGlass
        shape="pill"
        intensity="light"
        className="absolute inset-[-4px] z-0 opacity-0 group-hover:opacity-50 transition-all duration-500 scale-95 group-hover:scale-100 pointer-events-none"
      />

      {/* Energy pulse ring on click */}
      {burst && (
        <span
          className="absolute inset-0 rounded-full border border-[#00f3ff]/50 pointer-events-none"
          style={{ animation: 'energy-burst 0.6s ease-out forwards' }}
        />
      )}

      <span className="relative z-20 tracking-wide text-white/80 group-hover:text-white transition-colors">{label}</span>
      <ChevronRight className="relative z-20 w-4 h-4 text-white/80 group-hover:text-white transition-all group-hover:translate-x-[2px]" />
    </button>
  )
}

export default AppleButton
