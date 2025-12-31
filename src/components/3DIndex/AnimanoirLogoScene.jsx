import { Fragment, useRef, useMemo, useEffect } from "react";
import { Float, Environment } from "@react-three/drei";
import { AndrosFetal } from "./AndrosFetal/AndrosFetal.jsx"
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const AnimanoirLogoScene = () => {
  // Use refs instead of state to avoid re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);

  // Trail particles - single batched geometry (much more efficient)
  const PARTICLE_POOL_SIZE = 100; // Reduced from 200
  const trailParticlesRef = useRef();
  const trailPositions = useMemo(() => new Float32Array(PARTICLE_POOL_SIZE * 3), []);
  const trailColors = useMemo(() => new Float32Array(PARTICLE_POOL_SIZE * 3), []);
  const trailSizes = useMemo(() => new Float32Array(PARTICLE_POOL_SIZE), []);

  // Particle pool data (no geometry/material per particle)
  const particleData = useRef(
    Array.from({ length: PARTICLE_POOL_SIZE }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(),
      life: 0,
      maxLife: 1,
      size: 0.02,
      active: false,
    }))
  );

  const particlesRef = useRef();
  const envRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const environmentRef = useRef();
  const groupRef = useRef();
  const { gl, camera, scene } = useThree();

  // Reusable temp objects to avoid allocations
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());
  const tempRayOriginRef = useRef(new THREE.Vector3());
  const tempRayDirectionRef = useRef(new THREE.Vector3());
  const tempMouseWorldRef = useRef(new THREE.Vector3());
  const tempVelocityRef = useRef(new THREE.Vector3());

  // Create main particles system
  const particlesCount = 80;
  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 12;

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

  // Mouse event handlers - using refs to avoid re-renders
  useEffect(() => {
    const handlePointerMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mousePositionRef.current.x = x;
      mousePositionRef.current.y = y;
    };

    const handlePointerDown = () => { isMouseDownRef.current = true; };
    const handlePointerUp = () => { isMouseDownRef.current = false; };
    const handlePointerLeave = () => { isMouseDownRef.current = false; };

    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [gl]);

  // Find and activate an inactive particle from the pool
  const activateParticle = (mouseWorld) => {
    const particle = particleData.current.find(p => !p.active);
    if (!particle) return;

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

  // Frame counter for throttling updates
  const frameCounterRef = useRef(0);

  useFrame((state, delta) => {
    frameCounterRef.current++;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    // Rotate environment for dizzy effect (throttled - every 2 frames)
    if (scene.backgroundRotation && frameCounterRef.current % 2 === 0) {
      envRotationRef.current.y += delta * 0.05 * 2;
      envRotationRef.current.x += delta * 0.02 * 2;
      envRotationRef.current.z += delta * 0.01 * 2;

      scene.backgroundRotation.set(
        envRotationRef.current.x,
        envRotationRef.current.y,
        envRotationRef.current.z
      );
    }

    const time = state.clock.elapsedTime * 0.3;

    // Handle main particles animation (throttled - every 2 frames)
    if (particlesRef.current && frameCounterRef.current % 2 === 0) {
      const posArray = particlesRef.current.geometry.attributes.position.array;
      const colArray = particlesRef.current.geometry.attributes.color.array;

      for (let i = 0; i < posArray.length; i += 3) {
        const targetX = originalPositions[i] + Math.sin(time + i * 0.1) * 2;
        const targetY = originalPositions[i + 1] + Math.cos(time + i * 0.1) * 2;
        const targetZ = originalPositions[i + 2] + Math.sin(time + i * 0.1) * 2;

        posArray[i] = THREE.MathUtils.lerp(posArray[i], targetX, 0.04);
        posArray[i + 1] = THREE.MathUtils.lerp(posArray[i + 1], targetY, 0.04);
        posArray[i + 2] = THREE.MathUtils.lerp(posArray[i + 2], targetZ, 0.04);

        colArray[i] = (Math.sin(time * 0.5 + i * 0.2) + 1) / 2;
        colArray[i + 1] = (Math.cos(time * 0.3 + i * 0.3) + 1) / 2;
        colArray[i + 2] = (Math.sin(time * 0.2 + i * 0.4) + 1) / 2;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }

    const raycaster = raycasterRef.current;
    const mouseVector = mouseVectorRef.current;
    const rayOrigin = tempRayOriginRef.current;
    const rayDirection = tempRayDirectionRef.current;
    const mouseWorld = tempMouseWorldRef.current;
    const tempVelocity = tempVelocityRef.current;

    // Handle trail particles creation (throttled spawn rate)
    if (isMouseDownRef.current && frameCounterRef.current % 3 === 0) {
      mouseVector.set(mousePositionRef.current.x, mousePositionRef.current.y);
      raycaster.setFromCamera(mouseVector, camera);

      const planeZ = 0;
      rayOrigin.copy(raycaster.ray.origin);
      rayDirection.copy(raycaster.ray.direction);
      const distance = (planeZ - rayOrigin.z) / rayDirection.z;
      mouseWorld.copy(rayDirection).multiplyScalar(distance).add(rayOrigin);

      if (Math.random() < 0.6) {
        activateParticle(mouseWorld);
      }
    }

    // Update trail particles in batched geometry
    if (trailParticlesRef.current) {
      let hasActiveParticles = false;

      for (let i = 0; i < particleData.current.length; i++) {
        const particle = particleData.current[i];
        const idx = i * 3;

        if (!particle.active) {
          trailPositions[idx] = 0;
          trailPositions[idx + 1] = 0;
          trailPositions[idx + 2] = -1000; // Move off-screen
          trailSizes[i] = 0;
          continue;
        }

        hasActiveParticles = true;

        // Update position
        tempVelocity.copy(particle.velocity).multiplyScalar(delta);
        particle.position.add(tempVelocity);

        // Simplified floating motion
        particle.position.x += Math.sin(time * 2 + particle.id) * 0.01;
        particle.position.y += Math.cos(time * 2 + particle.id) * 0.01;

        // Decrease life
        particle.life -= delta / particle.maxLife;

        // Fade out
        particle.color.multiplyScalar(0.99);
        particle.size *= 0.995;

        // Update batched arrays
        trailPositions[idx] = particle.position.x;
        trailPositions[idx + 1] = particle.position.y;
        trailPositions[idx + 2] = particle.position.z;

        trailColors[idx] = particle.color.r;
        trailColors[idx + 1] = particle.color.g;
        trailColors[idx + 2] = particle.color.b;

        trailSizes[i] = particle.size;

        if (particle.life <= 0) {
          particle.active = false;
        }
      }

      // Only update if we have active particles
      if (hasActiveParticles) {
        trailParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        trailParticlesRef.current.geometry.attributes.color.needsUpdate = true;
        trailParticlesRef.current.geometry.attributes.size.needsUpdate = true;
      }
    }
  });

  return (
    <Fragment>
      <Environment
        ref={environmentRef}
        files={"/images/animanoir-xyz-space-small.hdr"}
        backgroundIntensity={1.2}
        background
        backgroundBlurriness={0.1}
      />

      <Float rotationIntensity={5} speed={0.4}>
        <AndrosFetal />
      </Float>

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
            size={0.07}
            vertexColors
            opacity={10.0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Trail particles - single batched geometry */}
      <points ref={trailParticlesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_POOL_SIZE}
            array={trailPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_POOL_SIZE}
            array={trailColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={PARTICLE_POOL_SIZE}
            array={trailSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </Fragment>
  );
};
