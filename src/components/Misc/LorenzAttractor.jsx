import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'

function LorenzSystem({ sigma = 10, rho = 28, beta = 8/3, dt = 0.01, iterations = 10000 }) {
  const lineRef = useRef()
  
  // Generate Lorenz Attractor points
  const points = useMemo(() => {
    const positions = []
    let x = 1, y = 1, z = 1
    
    for (let i = 0; i < iterations; i++) {
      const dx = sigma * (y - x)
      const dy = x * (rho - z) - y
      const dz = x * y - beta * z
      
      x += dx * dt
      y += dy * dt
      z += dz * dt
      
      positions.push(new THREE.Vector3(x * 0.1, y * 0.1, z * 0.1))
    }
    
    return positions
  }, [sigma, rho, beta, dt, iterations])
  
  // Animate the line
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color="red"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <LorenzSystem />
      <OrbitControls
        enablePan={true}
        enableZoom={false}
        enableRotate={true}
        minDistance={5}
        maxDistance={10}
        autoRotate={false}
      />
    </>
  )
}

export default function LorenzAttractor({ width = "100%", height = "400px" }) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [10, 10, 5], fov: 75 }}
        style={{ background: '#000' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}