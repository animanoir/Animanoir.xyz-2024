import * as THREE from "three";
import { Suspense, useState, useEffect, Fragment } from "react";
import { Float, Environment } from "@react-three/drei";
import { ModelANLogo } from "./ModelANLogo";
import { useFrame } from "@react-three/fiber";
import useArrayRef from "./hooks/useArrayRef";

export const Scene = () => {
  const [torusRefs, setTorusRef] = useArrayRef();
  const torusCount = 3;
  const [torusRotationFactors, setTorusRotationFactors] = useState([]);

  useEffect(() => {
    const newTorusRotationFactors = new Array(torusCount)
      .fill(0)
      .map(() => Math.random() * 0.5);
    setTorusRotationFactors(newTorusRotationFactors);
    torusRefs.current.forEach((ref, i) => {
      if (ref) {
        const randomFactor = torusRotationFactors[i] || 0;
        ref.rotation.x = Math.random() * 360;
        ref.rotation.z = Math.random() * 360;
        ref.rotation.y = Math.random() * 360;
      }
    });
  }, []);

  useFrame((state, delta) => {
    torusRefs.current.forEach((ref, i) => {
      if (ref) {
        const randomFactor = torusRotationFactors[i] || 0;
        ref.rotation.x += delta * 0.1 * randomFactor;
        ref.rotation.y -= delta * 0.4 * randomFactor;
        ref.rotation.z *= delta * 0.8 * randomFactor;
      }
    });
  });

  return (
    <Fragment>
      <Environment background files={"/images/animanoir-xyz-space-small.hdr"} />
      <directionalLight color={"white"} position={[0, 10, 100]} intensity={1} />
      {Array.from({ length: torusCount }, (_, i) => (
        <mesh
          toneMapped={false}
          ref={(el) => (torusRefs.current[i] = el)}
          key={i}
        >
          <meshStandardMaterial
            metalness={1}
            roughness={0}
            color={"#fff"}
            wireframe
          />
          <torusKnotGeometry args={[10 + i, i * 0.1, 100, i * 10]} />
        </mesh>
      ))}
      <Suspense>
        <Float speed={3}>
          <ModelANLogo />
        </Float>
      </Suspense>
    </Fragment>
  );
};
