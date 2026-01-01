import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useCallback } from "react";
import { Loader } from "@react-three/drei";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AnimanoirLogoScene } from "./AnimanoirLogoScene";
import "@/styles/canvasFiber.css";
import * as THREE from "three";

const FloatingCamera = ({ intensity = 0.15, speed = 0.3 }) => {
  const timeRef = useRef(0);
  const initialCameraPos = useRef(null);

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

    // Calculate orbit
    const radius = Math.sqrt(initialCameraPos.current.x ** 2 + initialCameraPos.current.z ** 2);
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

  const handleSceneCreated = useCallback(({ gl }) => {
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.AgXToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1.2;

    // Trigger fade-in after a small delay to ensure scene is rendered
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

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
    backgroundColor: "black",
    opacity: isLoaded ? 0 : 1,
    transition: "opacity 1s ease-out",
    pointerEvents: "none",
    zIndex: 10,
  };

  const cameraProps = {
    position: [0, 0, 15],
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
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        <AnimanoirLogoScene client:only="react" />
        <FloatingCamera intensity={1.0} speed={1.0} />
        <EffectComposer multisampling={0}>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
          <Vignette eskil={false} offset={0.1} darkness={0.2} />
        </EffectComposer>
      </Canvas>
      <div style={fadeOverlayStyle} />
      <Loader containerStyles={{ backgroundColor: "#060606" }} />
    </div>
  );
};

export default SceneIndex;
