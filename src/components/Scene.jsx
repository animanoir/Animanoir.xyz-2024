import * as THREE from "three";
import { Suspense, useState, useEffect, Fragment, useRef } from "react";
import { Float, Environment } from "@react-three/drei";
import { ModelANLogo } from "./ModelANLogo";
import { useFrame } from "@react-three/fiber";
import useArrayRef from "./hooks/useArrayRef";

export const Scene = () => {
  const ringOneRef = useRef();
  const ringTwoRef = useRef();
  const ringThreeRef = useRef();

  // Agregar useFrame para actualizar la rotación en cada fotograma
  useFrame((state, delta) => {
    if (ringOneRef.current) {
      ringOneRef.current.rotation.x += delta * -0.3; // Rotar lentamente en el eje Y
    }
    if (ringTwoRef.current) {
      ringTwoRef.current.rotation.y += delta * -0.4; // Rotar lentamente en el eje Y
    }
    if (ringThreeRef.current) {
      ringThreeRef.current.rotation.x += delta * -0.5; // Rotar lentamente en el eje Y
    }
  });
  return (
    <Fragment>
      <Environment background files={"/images/animanoir-xyz-space-small.hdr"} />
      <directionalLight color={"white"} position={[0, 10, 100]} intensity={1} />
      <mesh ref={ringOneRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[5, 0.5, 10, 100]} />
      </mesh>
      <mesh ref={ringTwoRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[10, 0.5, 10, 100]} />
      </mesh>
      <mesh ref={ringThreeRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[15, 1, 10, 100]} />
      </mesh>

      <Suspense>
        <Float speed={3}>
          <ModelANLogo />
        </Float>
      </Suspense>
    </Fragment>
  );
};

// const [torusRefs, setTorusRef] = useArrayRef();
// const torusCount = 3;
// const [torusRotationFactors, setTorusRotationFactors] = useState([]);

// useEffect(() => {
//   const newTorusRotationFactors = new Array(torusCount)
//     .fill(0)
//     .map(() => Math.random() * 0.5);
//   setTorusRotationFactors(newTorusRotationFactors);
//   torusRefs.current.forEach((ref, i) => {
//     if (ref) {
//       const randomFactor = torusRotationFactors[i] || 0;
//       ref.rotation.x = Math.random() * 360;
//       ref.rotation.z = Math.random() * 360;
//       ref.rotation.y = Math.random() * 360;
//     }
//   });
// }, []);

// useFrame((state, delta) => {
//   torusRefs.current.forEach((ref, i) => {
//     if (ref) {
//       const randomFactor = torusRotationFactors[i] || 0;
//       ref.rotation.x += delta * 0.1 * randomFactor;
//       ref.rotation.y -= delta * 0.4 * randomFactor;
//       ref.rotation.z *= delta * 0.8 * randomFactor;
//     }
//   });
// });
