import React, { Suspense, useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CircuitCanvas from './components/CircuitCanvas'
import ScrollIndicator from './components/ScrollIndicator'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

const App: React.FC = () => {
  const splineRef = useRef<any>(null)
  const baseCameraPos = useRef({ x: 0, y: 0, z: 0 })
  const targetPosition = useRef({ x: 0, y: 0, z: 0 })
  const currentPosition = useRef({ x: 0, y: 0, z: 0 })
  const requestRef = useRef<number>(0)

  function onLoad(splineApp: any) {
    splineRef.current = splineApp
    try {
      const camera = splineApp.findObjectByName('Camera') || splineApp.camera
      if (camera) {
        baseCameraPos.current = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        }
        targetPosition.current = { ...baseCameraPos.current }
        currentPosition.current = { ...baseCameraPos.current }
      }
    } catch (e) {
      console.log('Spline setup failed', e)
    }
  }

  const animate = () => {
    if (splineRef.current) {
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.05
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.05

      const camera = splineRef.current.findObjectByName('Camera') || splineRef.current.camera
      if (camera && baseCameraPos.current.z !== 0) {
        camera.position.x = currentPosition.current.x
        camera.position.y = currentPosition.current.y
      }
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!splineRef.current || baseCameraPos.current.z === 0) return
      
      const x = ((e.clientX / window.innerWidth) - 0.5)
      const y = ((e.clientY / window.innerHeight) - 0.5)
      
      // Gentle parallax - shifting the camera slightly based on mouse position
      // We do not add huge offsets here, preserving the native Spline composition
      targetPosition.current = {
        x: baseCameraPos.current.x + (x * 60),
        y: baseCameraPos.current.y + (y * -60),
        z: baseCameraPos.current.z
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white font-ui antialiased"
      style={{ filter: 'none !important' } as any}
    >
      {/* ── Fixed fullscreen Spline 3D background ── */}
      <div className="fixed z-0 pointer-events-none overflow-hidden" style={{ top: 0, left: 0, right: 0, bottom: '-60px' }}>
        <Suspense
          fallback={
            <div className="w-full h-full bg-[#0c0c0c]" />
          }
        >
          <Spline
            scene="https://prod.spline.design/nda7T1W4XzkMj6BX/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
            onLoad={onLoad}
          />
        </Suspense>
      </div>

      {/* ── Circuit canvas overlay ── */}
      <CircuitCanvas />

      {/* ── Sections ── */}
      <Navbar />
      <Hero />
      <ScrollIndicator />
    </div>
  )
}

export default App
