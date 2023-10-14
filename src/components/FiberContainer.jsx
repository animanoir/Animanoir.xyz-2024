import { useRef, useCallback, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import "../styles/fiberCanvas.css";
import { get } from "../pages/rss.xml";
import { useControls } from "leva";
import * as THREE from "three";
import { Bloom, DepthOfField } from "@react-three/postprocessing";

export const FiberCanvas = () => {
  const mouse = useRef([0, 0]);

  const sceneCreated = ({ gl }) => {
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1;
  };
  return (
    <div id="fiberCanvas">
      <Canvas
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        onCreated={sceneCreated}
        camera={{ position: [0, -1, 5], fov: 95 }}
      >
        <Scene />
        <OrbitControls
          minDistance={5}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={1}
        />

        <EffectComposer>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
          <Bloom intensity={0.5} />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  );
};

export default FiberCanvas;
