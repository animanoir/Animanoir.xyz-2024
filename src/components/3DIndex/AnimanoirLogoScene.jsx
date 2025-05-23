import { Fragment, useRef, useMemo, useState } from "react";
import { Float, Environment } from "@react-three/drei";
import {AndrosFetal} from "./AndrosFetal/AndrosFetal.jsx"
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const AnimanoirLogoScene = () => {

  const particlesRef = useRef();
  const [rotation, setRotation] = useState(0);
  const groupRef = useRef()
  // Create particles
  const particlesCount = 100;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const color = new THREE.Color(); // Reuse color object

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Assign a random color
      color.setHSL(Math.random(), 1.0, 0.5); // Hue, Saturation, Lightness
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current){
      groupRef.current.rotation.y += delta * 0.1;
    }
    setRotation((prev) => prev + delta * 0.05);
    // Particle animation
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array;
      const colArray = particlesRef.current.geometry.attributes.color.array; // Access color attribute
      const time = state.clock.elapsedTime;

      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] += Math.sin(time + i * 0.1) * 0.005; 
        posArray[i + 1] += Math.cos(time + i * 0.1) * 0.005;
        posArray[i + 2] += Math.sin(time + i * 0.1) * 0.005;

        colArray[i] = (Math.sin(time * 0.5 + i * 0.2) + 1) / 2; // Red channel
        colArray[i + 1] = (Math.cos(time * 0.3 + i * 0.3) + 1) / 2; // Green channel
        colArray[i + 2] = (Math.sin(time * 0.2 + i * 0.4) + 1) / 2; // Blue channel
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true; 
    }
  });

  return (
    <Fragment>
      <Environment
        files={"/images/animanoir-xyz-space-small.hdr"}
        backgroundRotation={[rotation, rotation, rotation]} 
        backgroundIntensity={0.1}
        background
      />
      <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute // Add color attribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          // color="#ffffff" // Remove fixed color
          vertexColors // Enable vertex colors
          // transparent
          opacity={10.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false} // Often needed for transparent particles
        />
      </points>
      </group>
      <Float rotationIntensity={10} speed={0.5}>
        <AndrosFetal />
      </Float>

    </Fragment>
  );
};
