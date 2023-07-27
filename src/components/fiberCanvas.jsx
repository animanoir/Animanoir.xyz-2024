import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene } from "./Scene";
import "../styles/fiberCanvas.css";

export const FiberContainer = () => {
  return (
    <div id="fiberCanvas">
      <Canvas
        style={{ backgroundColor: "black" }}
        camera={{ position: [14.4666, 2.0365, 5.556165], fov: 40 }}
      >
        <Scene />
        <OrbitControls minDistance={1} maxDistance={200} />
      </Canvas>
    </div>
  );
};

export default FiberContainer;
