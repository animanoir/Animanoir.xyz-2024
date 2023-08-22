import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { EffectComposer, Scanline, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import { Perf } from "r3f-perf";
import "../styles/fiberCanvas.css";
import { get } from "../pages/rss.xml";

export const FiberCanvas = () => {
  const sceneCreated = ({ gl }) => {
    console.log("Scene created: ", gl);
    gl.setClearColor("black", 1);
  };

  return (
    <div id="fiberCanvas">
      <Canvas
        onCreated={sceneCreated}
        camera={{ position: [0, 0, 5], fov: 100 }}
      >
        <Perf />
        <Stage>
          <Scene />
        </Stage>
        <OrbitControls
          autoRotate
          autoRotateSpeed={3}
          minDistance={1}
          maxDistance={100}
        />
        <EffectComposer>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default FiberCanvas;
