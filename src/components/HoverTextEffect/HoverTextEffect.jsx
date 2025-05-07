import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material for hover effect
const HoverShaderMaterial = ({ hover }) => {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.hover.value = hover ? 1.0 : 0.0;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        time: { value: 0 },
        hover: { value: 0 },
        color: { value: new THREE.Color('#ffffff') },
        accent: { value: new THREE.Color('#ff5e5e') }
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform float hover;
        uniform vec3 color;
        uniform vec3 accent;
        varying vec2 vUv;
        
        void main() {
          // Create wave effect when hovering
          float wave = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
          float waveMask = hover * wave * 0.6;
          
          // Mix between normal color and accent color based on hover state
          vec3 finalColor = mix(color, accent, waveMask);
          
          // Add glow effect on hover
          float glow = hover * 0.5 * (1.0 + sin(time * 3.0));
          finalColor = mix(finalColor, accent, glow * 0.3);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `}
    />
  );
};

// Text component with shader
const ShaderText = ({ text, position, size = 0.35 }) => {
  const [hover, setHover] = useState(false);
  const groupRef = useRef();

  return (
    <group 
      ref={groupRef}
      position={position} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Text
        fontSize={size}
        letterSpacing={0.05}
        font="/fonts/Montserrat-Regular.ttf"
      >
        {text}
        <HoverShaderMaterial hover={hover} />
      </Text>
    </group>
  );
};

// Wrapper component that will be used in Astro
const HoverTextEffect = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Center position={[0, 0, 0]}>
          <ShaderText 
            text="Software engineer" 
            position={[-2, 1.2, 0]} 
          />
          <ShaderText 
            text="specialized in" 
            position={[0.5, 1.2, 0]} 
          />
          <ShaderText 
            text="web development," 
            position={[-1.8, 0.6, 0]} 
          />
          <ShaderText 
            text="game programming" 
            position={[-1.8, 0, 0]} 
          />
          <ShaderText 
            text="& 3D/multimedia interactive art." 
            position={[-0.8, -0.6, 0]} 
          />
        </Center>
      </Canvas>
    </div>
  );
};

export default HoverTextEffect;