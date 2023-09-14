import * as THREE from "three";
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  Fragment,
  useMemo,
  useCallback,
  createRef,
} from "react";
import { Float, Text, Environment, useHelper, Sphere } from "@react-three/drei";
import { ModelANLogo } from "./ModelANLogo";
import { useControls } from "leva";
import { useFrame, useThree, extend } from "@react-three/fiber";
import useArrayRef from "./hooks/useArrayRef";

extend({ DodecahedronGeometry: THREE.DodecahedronGeometry });

function calculateColor(mx, my) {
  // Normaliza las coordenadas del ratón a un rango de [0, 1]
  const normX = Math.abs(mx) / document.documentElement.clientWidth;
  const normY = Math.abs(my) / document.documentElement.clientHeight;
  // Convierte las coordenadas normalizadas a valores RGB
  const r = Math.floor(normX * 255);
  const g = Math.floor(normY * 255);
  const b = Math.floor(((normX + normY) / 2) * 255);

  // Convierte los componentes RGB a un valor hexadecimal
  const rgbToHex = (rgb) => rgb.toString(16).padStart(2, "0");
  const color = `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`;

  return color;
}

// from https://codesandbox.io/s/react-three-fiber-particles-ii-forked-jmwv5y?file=/src/index.js:3485-3541
function Swarm({ count, mouse }) {
  const mesh = useRef();
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 10;
      const factor = Math.random();
      const speed = 0.01 + Math.random() / 1000;
      const xFactor = Math.random() * 10;
      const yFactor = Math.random() * 10;
      const zFactor = Math.random() * 10;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 10;
      const a = Math.cos(t) / 10;
      const b = Math.sin(t) / 10;
      const s = Math.cos(t);
      particle.mx += (mouse.current[0] - particle.mx) * 0.001;
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.001;
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 50 -
          8,
        (particle.my / 100) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 50 -
          5,
        (particle.my / 1) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 30) * factor) / 1 -
          1
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    console.log(mouse.current[0], mouse.current[1]);
  });
  console.log(mouse.current[0], mouse.current[1]);
  return (
    <Fragment>
      <pointLight ref={light} distance={100} intensity={500} color="white" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereGeometry attach="geometry" args={[0.01, 10]} />
        <meshStandardMaterial metalness={0} roughness={0} color={"#fff"} />
      </instancedMesh>
    </Fragment>
  );
}

export const Scene = ({ mouse }) => {
  const [torusRefs, setTorusRef] = useArrayRef();
  localStorage.clear();
  const torusCount = 5;

  // Inicializa torusRotationFactors al montar el componente
  useEffect(() => {
    const newTorusRotationFactors = new Array(torusCount)
      .fill(0)
      .map(() => Math.random() * 0.5);
    setTorusRotationFactors(newTorusRotationFactors);
  }, []);

  const [torusRotationFactors, setTorusRotationFactors] = useState([]);

  // const [wireframeModeOne, setWireframeModeOne] = useState(false);
  // const [wireframeModeTwo, setWireframeModeTwo] = useState(false);
  // const [wireframeModeThree, setWireframeModeThree] = useState(false);

  useEffect(() => {
    const timerOne = setInterval(() => {
      setWireframeModeOne((prevState) => !prevState);
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(timerOne);
  }, []);

  useEffect(() => {
    const timerTwo = setInterval(() => {
      setWireframeModeTwo((prevState) => !prevState);
    }, Math.random() * 3000 + 1000);

    return () => clearInterval(timerTwo);
  }, []);

  useEffect(() => {
    const timerThree = setInterval(() => {
      setWireframeModeThree((prevState) => !prevState);
    }, Math.random() * 4000 + 1000);

    return () => clearInterval(timerThree);
  }, []);
  useFrame((state, delta) => {
    torusRefs.current.forEach((ref, i) => {
      if (ref) {
        const randomFactor = torusRotationFactors[i] || 0;
        ref.rotation.y += delta * 0.2 * randomFactor;
        ref.rotation.z += delta * 0.5 * randomFactor;
        ref.rotation.y += delta * 0.5 * randomFactor;
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
          <meshStandardMaterial metalness={1} roughness={0.1} color={"#fff"} />
          <torusGeometry args={[5 + i, 0.2, 80, 80]} />
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
