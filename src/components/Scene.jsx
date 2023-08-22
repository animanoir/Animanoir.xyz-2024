import * as THREE from "three";
import { useRef } from "react";
import { Float, Text } from "@react-three/drei";
import { Suspense } from "react";
import { ModelANLogo } from "./ModelANLogo";

export const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        color={"white"}
        position={[15, 15, 15]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense>
        <ModelANLogo />
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
