import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useHelper } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import { Perf } from "r3f-perf";
import "../styles/fiberCanvas.css";
import { get } from "../pages/rss.xml";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import { Bloom } from "@react-three/postprocessing";

export const FiberCanvas = () => {
  const sceneCreated = ({ gl }) => {
    console.log("Scene created: ", gl);
    gl.setClearColor("black", 1);
  };

  return (
    <div id="fiberCanvas">
      <Canvas
        onCreated={sceneCreated}
        camera={{ position: [0, 0, 3], fov: 100 }}
      >
        <Perf />
        <Scene />
        <OrbitControls
          autoRotate
          autoRotateSpeed={2}
          minDistance={1}
          maxDistance={100}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={2}
          />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default FiberCanvas;
