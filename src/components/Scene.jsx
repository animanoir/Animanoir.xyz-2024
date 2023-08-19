import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Float, CameraShake, Text } from "@react-three/drei";

export const Scene = () => {
  const refTrees = useRef();

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
      <Float speed={10}>
        <Text>Óscar A. Montiel</Text>
      </Float>
    </>
  );
};

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
