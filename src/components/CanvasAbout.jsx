import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Box, Environment, Plane, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import "@/styles/canvasFiber.css";
import React, { useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { SITE_TITLE } from "../consts";

const CameraControl = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(5, -5, 0);
  }, [camera]);

  return null;
};

const CanvasAbout = () => {
  const texture = new THREE.TextureLoader().load(
    "images/oscar-a-montiel-animanoir-geosmina.jpg"
  );

  return (
    <Canvas
      camera={{ position: [0, 2, 2], fov: 45 }}
      style={{ display: "absolute", position: "fixed" }}
    >
      <CameraControl />
      <Perf />
      <ambientLight color={"white"} position={[9, 1, 4]} intensity={6} />
      <OrbitControls />
      <Float>
        <Box args={[2, 3, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial map={texture} />
        </Box>
        <Html position={[-1.5, 0, 0]}>
          <p className="title">Óscar A. Montiel</p>
        </Html>
      </Float>
    </Canvas>
  );
};

export default CanvasAbout;
