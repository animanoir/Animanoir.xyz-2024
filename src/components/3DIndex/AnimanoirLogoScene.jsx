import { Fragment, useRef, useMemo } from "react";
import { Float, Environment } from "@react-three/drei";
import { ModelANLogo } from "./ModelANLogo";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const AnimanoirLogoScene = () => {
  const ringOneRef = useRef();
  const ringTwoRef = useRef();
  const ringThreeRef = useRef();
  const particlesRef = useRef();

  // Create particles
  const particlesCount = 2000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ringOneRef.current) {
      ringOneRef.current.rotation.x += delta * -0.5;
    }
    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.y += delta * -0.4;
    }
    if (ringThreeRef.current) {
      ringThreeRef.current.rotation.x += delta * -0.3;
    }

    // Particle animation
    if (particlesRef.current) {
      const particles = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particles.length; i += 3) {
        particles[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        particles[i + 1] += Math.cos(state.clock.elapsedTime + i) * 0.01;
        particles[i + 2] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const materialProps = {
    metalness: 1,
    roughness: 0.1,
    color: "#fff",
  };

  return (
    <Fragment>
      <Environment background files={"/images/animanoir-xyz-space-small.hdr"} />
      <directionalLight color={"white"} position={[0, 10, 100]} intensity={1} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh ref={ringOneRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[5, 0.3, 10, 100]} />
      </mesh>
      <mesh ref={ringTwoRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[10, 0.5, 10, 100]} />
      </mesh>
      <mesh ref={ringThreeRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[15, 1, 10, 100]} />
      </mesh>
      <Float speed={7}>
        <ModelANLogo />
      </Float>
    </Fragment>
  );
};
