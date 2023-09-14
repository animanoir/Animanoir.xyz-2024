import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useHelper } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import { Perf } from "r3f-perf";
import "../styles/fiberCanvas.css";
import { get } from "../pages/rss.xml";
import { useControls } from "leva";
import { useRef, useCallback } from "react";
import * as THREE from "three";
import { Bloom, DepthOfField } from "@react-three/postprocessing";

export const FiberCanvas = () => {
  const mouse = useRef([0, 0]);
  const sceneCreated = ({ gl }) => {
    console.log("Scene created: ", gl);
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1;
  };
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );
  return (
    <div id="fiberCanvas">
      <Canvas
        onMouseMove={onMouseMove}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        onCreated={sceneCreated}
        camera={{ position: [0, -1, 7], fov: 120 }}
      >
        <Perf />
        <Scene mouse={mouse} />
        <OrbitControls minDistance={4} maxDistance={6} />
        <EffectComposer>
          <Bloom intensity={1} />
          <DepthOfField
            focusDistance={0.007}
            focalLength={0.025}
            bokehScale={10}
          />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default FiberCanvas;
