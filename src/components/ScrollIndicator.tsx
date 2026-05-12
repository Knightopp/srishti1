import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-ui">
            Scroll
          </span>
          <div className="scroll-indicator flex flex-col items-center">
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollIndicator
