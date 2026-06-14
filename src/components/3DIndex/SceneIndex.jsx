import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useCallback, useEffect } from "react";
import { Loader, useGLTF, useProgress } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AnimanoirLogoScene } from "./AnimanoirLogoScene";
import { useScrollEffect } from "./useScrollEffect";
import "@/styles/canvasFiber.css";
import * as THREE from "three";

const FloatingCamera = ({ intensity = 0.15, speed = 0.3, scrollEffectRef }) => {
  const timeRef = useRef(0);
  const initialCameraPos = useRef(null);
  const baseRadiusRef = useRef(null);

  const noiseOffsets = useRef({
    x1: Math.random() * 100,
    x2: Math.random() * 100,
    y1: Math.random() * 100,
    y2: Math.random() * 100,
    z1: Math.random() * 100,
  });

  useFrame(({ camera }, delta) => {
    if (!initialCameraPos.current) {
      initialCameraPos.current = camera.position.clone();
      baseRadiusRef.current = Math.sqrt(
        initialCameraPos.current.x ** 2 + initialCameraPos.current.z ** 2
      );
    }

    timeRef.current += delta * speed;

    const t = timeRef.current;
    const { x1, x2, y1, y2, z1 } = noiseOffsets.current;

    const noiseX = (
      Math.sin(t * 0.5 + x1) * 0.5 +
      Math.sin(t * 1.1 + x2) * 0.3
    ) * intensity;

    const noiseY = (
      Math.sin(t * 0.6 + y1) * 0.5 +
      Math.sin(t * 1.3 + y2) * 0.3
    ) * intensity;

    const noiseZ = (
      Math.sin(t * 0.7 + z1) * 0.3
    ) * intensity;

    // Scroll-driven zoom out: increase orbit radius up to +8 units
    const scrollEffect = scrollEffectRef ? scrollEffectRef.current : 0;
    const zoomOutAmount = scrollEffect * 8;
    const radius = baseRadiusRef.current + zoomOutAmount;

    const rotationSpeed = 0.1;
    const angle = t * rotationSpeed;

    const orbitX = Math.sin(angle) * radius;
    const orbitZ = Math.cos(angle) * radius;

    // Apply noise to camera position
    camera.position.x = orbitX + noiseX;
    camera.position.y = initialCameraPos.current.y + noiseY;
    camera.position.z = orbitZ + noiseZ * 2.0;

    // Look at center
    camera.lookAt(0, 0, 0);

    // Subtle camera rotation for enhanced drunk effect on top
    camera.rotation.x += Math.sin(t * 0.5 + x1) * 0.01 * intensity;
    camera.rotation.y += Math.sin(t * 0.6 + y1) * 0.01 * intensity;
  });
  return null;
};

export const SceneIndex = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { progress } = useProgress();
  const scrollEffectRef = useScrollEffect();
  const blurOverlayRef = useRef(null);

  // Preload heavy assets ahead of render to avoid Loader stalling at 0%
  useEffect(() => {
    useGLTF.preload("/andros_fetal.glb");
  }, []);

  const handleSceneCreated = useCallback(({ gl }) => {
    gl.setClearColor("#0a0a0a", 1);
    gl.toneMapping = THREE.AgXToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1.2;
  }, []);

  // Fade overlay once loader hits ~100% (with a tiny delay for final render)
  useEffect(() => {
    if (progress >= 99) {
      const timeout = setTimeout(() => setIsLoaded(true), 150);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  // Safety net: never leave the screen black if progress cannot reach 100%
  useEffect(() => {
    const fallback = setTimeout(() => setIsLoaded(true), 8000);
    return () => clearTimeout(fallback);
  }, []);

  // Sync scroll effect intensity → CSS blur via direct DOM mutation (no re-renders)
  useEffect(() => {
    let rafId;
    const syncBlur = () => {
      if (blurOverlayRef.current) {
        const maxBlur = 6; // pixels
        const blur = scrollEffectRef.current * maxBlur;
        const blurVal = `blur(${blur.toFixed(1)}px)`;
        blurOverlayRef.current.style.backdropFilter = blurVal;
        blurOverlayRef.current.style.webkitBackdropFilter = blurVal;
      }
      rafId = requestAnimationFrame(syncBlur);
    };
    rafId = requestAnimationFrame(syncBlur);
    return () => cancelAnimationFrame(rafId);
  }, [scrollEffectRef]);

  const canvasStyle = {
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const fadeOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0a0a",
    opacity: isLoaded ? 0 : 1,
    transition: "opacity 1s ease-out",
    pointerEvents: "none",
    zIndex: 10,
  };

  const cameraProps = {
    position: [0, 0, 16],
    fov: 40,
  };

  return (
    <div id="fiberCanvas">
      <Canvas
        onCreated={handleSceneCreated}
        camera={cameraProps}
        style={canvasStyle}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          stencil: false,
          depth: true
        }}
      >
        <AnimanoirLogoScene client:only="react" />
        <FloatingCamera intensity={1.0} speed={1.0} scrollEffectRef={scrollEffectRef} />
        <EffectComposer multisampling={0}>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
          <Vignette eskil={false} offset={0.1} darkness={0.2} />
        </EffectComposer>
      </Canvas>
      {/* Scroll-driven blur overlay — always mounted to avoid flicker */}
      <div
        ref={blurOverlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
      <div style={fadeOverlayStyle} />
      <Loader containerStyles={{ backgroundColor: "#0a0a0a" }} />
    </div>
  );
};

export default SceneIndex;
