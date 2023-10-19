import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import { EffectComposer, Noise, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import "@/styles/canvasFiber.css";
import * as THREE from "three";

export const FiberCanvas = () => {
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
    position: [0, -1, 11],
    fov: 50,
  };

  return (
    <div id="fiberCanvas">
      <Canvas onCreated={sceneCreated} camera={cameraProps} style={canvasStyle}>
        <Scene />
        <OrbitControls
          enableDamping
          minDistance={10}
          maxDistance={27}
          autoRotate
          autoRotateSpeed={1}
        />
        <EffectComposer>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
          <Bloom intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <Loader containerStyles={{ backgroundColor: "#060606" }} />
    </div>
  );
};

export default FiberCanvas;
