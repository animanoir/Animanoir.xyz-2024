import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { EffectComposer, Scanline, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Scene } from "./Scene";
import "../styles/fiberCanvas.css";

export const FiberContainer = () => {
  return (
    <div id="fiberCanvas">
      <Canvas
        style={{ backgroundColor: "black" }}
        camera={{ position: [14.4666, 2.0365, 5.556165], fov: 45 }}
      >
        <Scene />
        <OrbitControls autoRotate minDistance={1} maxDistance={100} />
        <EffectComposer>
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        </EffectComposer>
        <Stats />
      </Canvas>
    </div>
  );
};

export default FiberContainer;
