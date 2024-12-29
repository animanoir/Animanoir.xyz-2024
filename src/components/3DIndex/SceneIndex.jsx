import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import { EffectComposer, Noise, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AnimanoirLogoScene } from "./AnimanoirLogoScene";
import "@/styles/canvasFiber.css";
import * as THREE from "three";


export const SceneIndex = () => {


  const sceneCreated = ({ gl }) => {
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1;
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
    position: [0, -0, -12],
    fov: 70,
  };


  return (
    <div id="fiberCanvas">
      <Canvas onCreated={sceneCreated} camera={cameraProps} style={canvasStyle}>
        <AnimanoirLogoScene />
        <OrbitControls
          enableDamping
          minDistance={10}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={-1}
          target={[0, 0, 0]}
        />
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={0.7}  />
          <DepthOfField
            focusDistance={0.5}    // Move focus point to scene center
            focalLength={10.0}      // Increase for stronger focus effect
            bokehScale={50}         // More pronounced bokeh effect
            height={720}  
          />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.25} />
          <Bloom intensity={0.8} />
        </EffectComposer>
      </Canvas>
      <Loader containerStyles={{ backgroundColor: "#060606" }} />
    </div>
  );
};

export default SceneIndex;
