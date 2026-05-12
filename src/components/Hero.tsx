import React from 'react'
import { motion } from 'motion/react'
import AppleButton from './AppleButton'
import LogoMark from './LogoMark'

const gradientStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #00f3ff 0%, #00d2ff 25%, #0066ff 50%, #00d2ff 75%, #00f3ff 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
}

const taglineWords = ['Tech', 'Culture', 'Innovation', 'Chaos']

const Hero: React.FC = () => (
  <section className="relative z-10 min-h-screen flex items-center px-8 md:pl-24 lg:pl-32 overflow-hidden">
    {/* ── Logo geometry watermark ── */}
    <div className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.025] z-0">
      <LogoMark className="w-[700px] h-[700px]" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
      <motion.div
        className="flex flex-col items-start text-left pt-20 md:pt-28"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
        {/* ── Main heading ── */}
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="heading-group text-6xl md:text-[10rem] font-bold tracking-tighter leading-[0.82] uppercase font-display cursor-default"
        >
          <span className="block text-white/90 heading-glow">SRISHTI</span>
          <span className="relative block animate-shiny heading-glow" style={gradientStyle}>
            Unleashed
            {/* Animated glow behind UNLEASHED */}
            <div className="unleashed-glow" />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 max-w-xl"
        >
          <p className="text-lg md:text-xl text-white/45 leading-relaxed font-light font-ui">
            Srishti 2.7 is the premier techno cultural fest by the Department of
            Computer Science, St Thomas College (Autonomous), Thrissur. Immerse
            yourself in a convergence of innovation and creativity.
          </p>

          {/* ── Micro tagline ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-5 flex items-center"
          >
            {taglineWords.map((word, i) => (
              <React.Fragment key={word}>
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/25 font-ui font-medium">
                  {word}
                </span>
                {i < taglineWords.length - 1 && <span className="tagline-dot" />}
              </React.Fragment>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <AppleButton label="Register Now" />
            <div className="flex flex-col border-l border-white/10 pl-6">
              <span className="text-xs uppercase tracking-[0.3em] text-white/30 font-ui">Hosted by</span>
              <span className="text-sm font-medium text-white/60 font-ui">Dept. of Computer Science</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Empty right side to showcase the Spline asset */}
      <div className="hidden md:block h-full" />
    </div>
  </section>
)

export default Hero
