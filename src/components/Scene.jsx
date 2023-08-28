import * as THREE from "three";
import { useRef } from "react";
import { Float, Text, Environment, useHelper } from "@react-three/drei";
import { Suspense } from "react";
import { ModelANLogo } from "./ModelANLogo";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

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
    <>
      <Environment background files={"/images/animanoir-xyz-space-small.hdr"} />
      // <ambientLight intensity={0.1} />
      <directionalLight
        color={"white"}
        position={[9, 1, 4]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <mesh ref={ringOneRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[5, 1, 10, 50]} />
      </mesh>
      <mesh ref={ringTwoRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[10, 1, 10, 50]} />
      </mesh>
      <mesh ref={ringThreeRef}>
        <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
        <torusGeometry args={[15, 1, 10, 50]} />
      </mesh>
      <Suspense>
        <Float speed={5}>
          <ModelANLogo />
        </Float>
      </Suspense>
    </>
  );
};

// <primitive object={logoAnimanoir.scene} position={[0, 0, 0]} />
// function Box(props) {
//   const mesh = useRef();

//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   // useFrame((state, delta) => (mesh.current.rotation.x += delta));
//   return (
//     <Float>
//       <mesh
//         {...props}
//         ref={mesh}
//         scale={active ? 1.5 : 1}
//         onClick={(event) => setActive(!active)}
//         onPointerOver={(event) => setHover(true)}
//         onPointerOut={(event) => setHover(false)}
//       >
//         <boxGeometry args={[2, 2, 2]} />
//         <meshNormalMaterial />
//       </mesh>
//     </Float>
//   );
// }
