import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Menu } from 'lucide-react'
import LogoMark from './LogoMark'
import AppleButton from './AppleButton'
import { LiquidGlass } from './ui/LiquidGlass'
import GlassParticles from './ui/GlassParticles'

const navLinks = ['Events', 'Schedule', 'Gallery', 'About', 'Register']

const Navbar: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-6 left-0 right-0 z-50 px-8 md:px-12 lg:px-24 flex items-center justify-between pointer-events-none"
    >
      {/* Left — Logo */}
      <div className="pointer-events-auto flex-1">
        <LogoMark />
      </div>

      {/* Center — Liquid Glass Links with particles */}
      <LiquidGlass shape="pill" intensity="medium" className="hidden md:flex items-center px-6 py-2.5 pointer-events-auto relative">
        <GlassParticles />
        {navLinks.map((link, i) => (
          <React.Fragment key={link}>
            <motion.a
              href={`#${link.toLowerCase()}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              className="relative text-white/60 text-sm font-medium hover:text-white transition-all tracking-wide px-4 py-1.5 font-ui"
            >
              {/* Glow tracking pill */}
              {hoveredIndex === i && (
                <motion.div
                  layoutId="nav-glow-pill"
                  className="absolute inset-0 rounded-full bg-[#00f3ff]/8 border border-[#00f3ff]/15 shadow-[0_0_14px_rgba(0,243,255,0.12)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">{link}</span>
            </motion.a>
            {i < navLinks.length - 1 && (
              <span className="text-white/15 text-xs font-light select-none">|</span>
            )}
          </React.Fragment>
        ))}
      </LiquidGlass>

      {/* Right — Desktop CTA */}
      <div className="hidden md:flex justify-end pointer-events-auto flex-1">
        <AppleButton label="Register Now" />
      </div>

      {/* Right — Mobile menu button */}
      <button className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center pointer-events-auto">
        <Menu className="w-5 h-5 text-white" />
      </button>
    </motion.nav>
  )
}

export default Navbar
