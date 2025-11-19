import { Fragment, useRef, useMemo, useState, useEffect } from "react";
import { Float, Environment } from "@react-three/drei";
import { AndrosFetal } from "./AndrosFetal/AndrosFetal.jsx"
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const AnimanoirLogoScene = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  // Particle pool for trail particles (fixed size, reusable)
  const PARTICLE_POOL_SIZE = 200;
  const particlePool = useRef(
    Array.from({ length: PARTICLE_POOL_SIZE }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(),
      life: 0,
      maxLife: 1,
      size: 0.5,
      active: false,
      geometry: (() => {
        const geometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(3);
        geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        geometry.userData.positionArray = positionArray;
        return geometry;
      })(),
      material: new THREE.PointsMaterial({
        size: 0.02,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    }))
  );
  const particlesRef = useRef();
  const envRotationRef = useRef(0);
  const environmentRef = useRef();
  const groupRef = useRef();
  const { gl, camera, scene } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());
  const tempRayOriginRef = useRef(new THREE.Vector3());
  const tempRayDirectionRef = useRef(new THREE.Vector3());
  const tempMouseWorldRef = useRef(new THREE.Vector3());
  const tempVelocityRef = useRef(new THREE.Vector3());

  // Create main particles system
  const particlesCount = 100;
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

  // Mouse event handlers
  useEffect(() => {
    const handlePointerMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    const handlePointerDown = () => setIsMouseDown(true);
    const handlePointerUp = () => setIsMouseDown(false);
    const handlePointerLeave = () => setIsMouseDown(false);

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

  useEffect(() => () => {
    particlePool.current.forEach((particle) => {
      particle.geometry.dispose();
      particle.material.dispose();
    });
  }, []);

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

    const positionArray = particle.geometry.attributes.position.array;
    positionArray[0] = particle.position.x;
    positionArray[1] = particle.position.y;
    positionArray[2] = particle.position.z;
    particle.geometry.attributes.position.needsUpdate = true;

    particle.material.color.copy(particle.color);
    particle.material.opacity = particle.life;
    particle.material.size = particle.size;
  };

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    // Rotate environment for dizzy effect
    if (scene.backgroundRotation) {
      scene.backgroundRotation.y += delta * 0.05;
      scene.backgroundRotation.x += delta * 0.02;
      scene.backgroundRotation.z += delta * 0.01;
    }

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

    const raycaster = raycasterRef.current;
    const mouseVector = mouseVectorRef.current;
    const rayOrigin = tempRayOriginRef.current;
    const rayDirection = tempRayDirectionRef.current;
    const mouseWorld = tempMouseWorldRef.current;
    const tempVelocity = tempVelocityRef.current;
    // Handle trail particles creation and animation
    if (isMouseDown) {
      // Convert mouse position to world coordinates using raycasting
      mouseVector.set(mousePosition.x, mousePosition.y)
      raycaster.setFromCamera(mouseVector, camera);

      // Project to a plane at z = 0 (where particles will spawn)
      const planeZ = 0;
      rayOrigin.copy(raycaster.ray.origin);
      rayDirection.copy(raycaster.ray.direction);
      const distance = (planeZ - rayOrigin.z) / rayDirection.z;
      mouseWorld.copy(rayDirection).multiplyScalar(distance).add(rayOrigin);

      // Activate trail particles from pool (spawn rate controlled by time)
      if (Math.random() < 0.8) { // 80% chance per frame to activate particle
        activateParticle(mouseWorld, time);
      }
    }

    // Update active trail particles in pool
    for (const particle of particlePool.current) {
      if (!particle.active) continue;

      // Update position
      tempVelocity.copy(particle.velocity).multiplyScalar(delta);
      particle.position.add(tempVelocity);

      // Add some floating motion
      particle.position.x += Math.sin(time * 2 + particle.id) * 0.01;
      particle.position.y += Math.cos(time * 2 + particle.id) * 0.01;
      particle.position.z += Math.sin(time * 1.5 + particle.id) * 0.01;

      // Decrease life
      particle.life -= delta / particle.maxLife;

      // Fade out over time
      particle.color.multiplyScalar(0.99); // More subtle fading
      particle.size *= 0.995; // More subtle size reduction

      const positionArray = particle.geometry.attributes.position.array;
      positionArray[0] = particle.position.x;
      positionArray[1] = particle.position.y;
      positionArray[2] = particle.position.z;
      particle.geometry.attributes.position.needsUpdate = true;

      particle.material.color.copy(particle.color);
      particle.material.opacity = Math.max(particle.life, 0);
      particle.material.size = particle.size;
      particle.material.needsUpdate = true;

      // Deactivate dead particles instead of removing them
      if (particle.life <= 0) {
        particle.active = false;
        particle.material.opacity = 0;
      }
    }
  });

  return (
    <Fragment>
      <Environment
        ref={environmentRef}
        files={"/images/animanoir-xyz-space-small.hdr"}
        backgroundIntensity={1}
        background
        backgroundBlurriness={0.1}
      />

      <Float rotationIntensity={10} speed={0.5}>
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
          <points
            key={particle.id}
            geometry={particle.geometry}
            material={particle.material}
            frustumCulled={false}
          />
        ))}

    </Fragment>
  );
};
