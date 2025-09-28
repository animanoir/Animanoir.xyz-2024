import { Fragment, useRef, useMemo, useState, useEffect } from "react";
import { Float, Environment } from "@react-three/drei";
import { AndrosFetal } from "./AndrosFetal/AndrosFetal.jsx"
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const AnimanoirLogoScene = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  // Particle pool for trail particles (fixed size, reusable)
  const PARTICLE_POOL_SIZE = 300;
  const particlePool = useRef(
    Array.from({ length: PARTICLE_POOL_SIZE }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(),
      life: 0,
      maxLife: 1,
      size: 0.5,
      active: false
    }))
  );
  const particlesRef = useRef();
  const [envRotation, setEnvRotation] = useState(0);
  const groupRef = useRef();
  const { gl, camera } = useThree();

  // Create main particles system
  const particlesCount = 100;
  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      color.setHSL(Math.random(), 1.0, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors, originalPositions };
  }, []);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', () => setIsMouseDown(false));

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', () => setIsMouseDown(false));
    };
  }, [gl]);

  // Find and activate an inactive particle from the pool
  const activateParticle = (mouseWorld, time) => {
    const particle = particlePool.current.find(p => !p.active);
    if (!particle) return; // Pool exhausted

    // Reset particle properties
    particle.position.set(
      mouseWorld.x + (Math.random() - 0.5) * 0.5,
      mouseWorld.y + (Math.random() - 0.5) * 0.5,
      mouseWorld.z + (Math.random() - 0.5) * 0.5
    );
    particle.velocity.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );
    particle.color.setRGB(Math.random(), Math.random(), Math.random());
    particle.life = 1.0;
    particle.maxLife = 3.0 + Math.random() * 2.0;
    particle.size = 0.02 + Math.random() * 0.03;
    particle.active = true;
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    setEnvRotation((prev) => prev + delta * 0.05);

    const time = state.clock.elapsedTime * 0.3;

    // Handle main particles animation
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array;
      const colArray = particlesRef.current.geometry.attributes.color.array;

      for (let i = 0; i < posArray.length; i += 3) {
        // Normal floating behavior
        const targetX = originalPositions[i] + Math.sin(time + i * 0.1) * 2;
        const targetY = originalPositions[i + 1] + Math.cos(time + i * 0.1) * 2;
        const targetZ = originalPositions[i + 2] + Math.sin(time + i * 0.1) * 2;

        posArray[i] = THREE.MathUtils.lerp(posArray[i], targetX, 0.02);
        posArray[i + 1] = THREE.MathUtils.lerp(posArray[i + 1], targetY, 0.02);
        posArray[i + 2] = THREE.MathUtils.lerp(posArray[i + 2], targetZ, 0.02);

        // Animate colors
        colArray[i] = (Math.sin(time * 0.5 + i * 0.2) + 1) / 2;
        colArray[i + 1] = (Math.cos(time * 0.3 + i * 0.3) + 1) / 2;
        colArray[i + 2] = (Math.sin(time * 0.2 + i * 0.4) + 1) / 2;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    // Handle trail particles creation and animation
    if (isMouseDown) {
      // Convert mouse position to world coordinates using raycasting
      mouseVector.set(mousePosition.x, mousePosition.y)
      raycaster.setFromCamera(mouseVector, camera);

      // Project to a plane at z = 0 (where particles will spawn)
      const planeZ = 0;
      const distance = (planeZ - camera.position.z) / raycaster.ray.direction.z;
      const mouseWorld = raycaster.ray.origin.clone().add(
        raycaster.ray.direction.clone().multiplyScalar(distance)
      );

      // Activate trail particles from pool (spawn rate controlled by time)
      if (Math.random() < 0.8) { // 80% chance per frame to activate particle
        activateParticle(mouseWorld, time);
      }
    }

    // Update active trail particles in pool
    for (const particle of particlePool.current) {
      if (!particle.active) continue;

      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Add some floating motion
      particle.position.x += Math.sin(time * 2 + particle.id) * 0.01;
      particle.position.y += Math.cos(time * 2 + particle.id) * 0.01;
      particle.position.z += Math.sin(time * 1.5 + particle.id) * 0.01;

      // Decrease life
      particle.life -= delta / particle.maxLife;

      // Fade out over time
      particle.color.multiplyScalar(0.99); // More subtle fading
      particle.size *= 0.995; // More subtle size reduction

      // Deactivate dead particles instead of removing them
      if (particle.life <= 0) {
        particle.active = false;
      }
    }
  });

  return (
    <Fragment>
      <Environment
        files={"/images/animanoir-xyz-space-small.hdr"}
        backgroundRotation={[envRotation, envRotation, envRotation]}
        backgroundIntensity={1}
        background
        backgroundBlurriness={0.1}
      />

      {/* Main particles */}
      <group ref={groupRef}>
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            vertexColors
            opacity={10.0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Trail particles from pool */}
      {particlePool.current
        .filter(particle => particle.active)
        .map(particle => (
          <points key={particle.id} position={particle.position.toArray()}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={1}
                array={new Float32Array([0, 0, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={particle.size}
              color={particle.color}
              opacity={particle.life}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        ))}

      <Float rotationIntensity={10} speed={0.5}>
        <AndrosFetal />
      </Float>
    </Fragment>
  );
};
