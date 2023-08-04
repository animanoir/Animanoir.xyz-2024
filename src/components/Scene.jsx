import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Float } from "@react-three/drei";

function Box(props) {
  const mesh = useRef();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.x += delta));
  return (
    <Float>
      <mesh
        {...props}
        ref={mesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshNormalMaterial />
      </mesh>
    </Float>
  );
}

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
      <Box position={[0, 0, 0]} />
    </>
  );
};
