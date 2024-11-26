import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import { EffectComposer, Noise, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AnimanoirLogo } from "./AnimanoirLogo";
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
        <AnimanoirLogo />
        <OrbitControls
          enableDamping
          minDistance={10}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={-1}
          target={[0, 0, 0]}
        />
        <EffectComposer>
          <Vignette darkness={0.4} />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.25} />
          <Bloom intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <Loader containerStyles={{ backgroundColor: "#060606" }} />
    </div>
  );
};

export default SceneIndex;
