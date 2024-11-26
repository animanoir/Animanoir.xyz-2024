import { Fragment, useRef } from "react";
import { Float, Environment } from "@react-three/drei";
import { ModelANLogo } from "./ModelANLogo";
import { useFrame } from "@react-three/fiber";

export const AnimanoirLogoScene = () => {
  const ringOneRef = useRef();
  const ringTwoRef = useRef();
  const ringThreeRef = useRef();

  useFrame((state, delta) => {
    if (ringOneRef.current) {
      ringOneRef.current.rotation.x += delta * -0.5;
    }
    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.y += delta * -0.4;
    }
    if (ringThreeRef.current) {
      ringThreeRef.current.rotation.x += delta * -0.3;
    }
  });

  const materialProps = {
    metalness: 1,
    roughness: 0.1,
    color: "#fff",
  };

  return (
    <Fragment>
      <Environment background files={"/images/animanoir-xyz-space-small.hdr"} />
      <directionalLight color={"white"} position={[0, 10, 100]} intensity={1} />
      <mesh ref={ringOneRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[5, 0.3, 10, 100]} />
      </mesh>
      <mesh ref={ringTwoRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[10, 0.5, 10, 100]} />
      </mesh>
      <mesh ref={ringThreeRef}>
        <meshStandardMaterial {...materialProps} />
        <torusGeometry args={[15, 1, 10, 100]} />
      </mesh>
      <Float speed={7}>
        <ModelANLogo />
      </Float>
    </Fragment>
  );
};
