import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Loader } from "@react-three/drei";
import { EffectComposer, Noise, Bloom, Vignette} from "@react-three/postprocessing";
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
    
    // Apply noise to camera position
    camera.position.x = initialCameraPos.current.x + noiseX;
    camera.position.y = initialCameraPos.current.y + noiseY;
    camera.position.z = initialCameraPos.current.z + noiseZ * 2.0;
    
    // Subtle camera rotation for enhanced drunk effect
    camera.rotation.x = Math.sin(t * 0.5 + x1) * 0.01 * intensity;
    camera.rotation.y = Math.sin(t * 0.6 + y1) * 0.01 * intensity;
  });
  
  return null;
};

export const SceneIndex = () => {

  const sceneCreated = ({ gl }) => {
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.AgXToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1.0;
  };

  const canvasStyle = {
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const cameraProps = {
    position: [0, 0, 18],
    fov: 45,
  };

  return (
    <div id="fiberCanvas">
      <Canvas onCreated={sceneCreated} camera={cameraProps} style={canvasStyle}>
        <AnimanoirLogoScene client:only="react"/>
        <FloatingCamera intensity={1.0} speed={1.0} />
        <EffectComposer>
          <Bloom
            intensity={2.0}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.15} />
          <Vignette eskil={false} offset={0.1} darkness={0.2}  />
        </EffectComposer>
      </Canvas>
      <Loader containerStyles={{ backgroundColor: "#060606" }} />
    </div>
  );
};

export default SceneIndex;
