import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBX, Environment, Float, Html, useProgress, Loader  } from '@react-three/drei';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from "postprocessing";
import * as THREE from 'three';

const AndrosOne = () => {
  const fbx = useFBX('/andros-baile-general-lento.fbx');
  const mixer = useRef();

  useEffect(() => {
    fbx.position.set(0, -5.0, 0);
    fbx.scale.setScalar(0.05);
    
    mixer.current = new THREE.AnimationMixer(fbx);
    const action = mixer.current.clipAction(fbx.animations[0]);
    action.play();

    const newMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 1.3, // Adjust metalness
      roughness: 0.1, // Adjust roughness
    });
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = newMaterial;
      }
    })

    return () => mixer.current.stopAllAction();
  }, [fbx]);

  useFrame((state, delta) => {
    mixer.current.update(delta*1.5);
    // fbx.rotation.y += delta * 0.05;
  });

  return <primitive object={fbx} />;
};

const DrunkenCamera = ({ isDrunk, fovModulation }) => {
  const { camera } = useThree();
  const drunkMagnitude = 0.09;
  const drunkSpeed = 0.0035;
  const baseFOV = 80;
  const fovAmplitude = 220;
  const fovFrequency = 0.0023;

  useFrame(() => {
    if (true) {
      const time = Date.now() * drunkSpeed;
      camera.rotation.x = Math.sin(time) * drunkMagnitude;
      camera.rotation.y = Math.cos(time * 0.5) * drunkMagnitude;
      camera.rotation.z = Math.sin(time * 0.5) * drunkMagnitude * 2.5;
    }

    const newFOV = baseFOV + Math.sin(Date.now() * fovFrequency) * fovAmplitude * fovModulation;
    camera.fov = newFOV;
    camera.updateProjectionMatrix();
  });

  return null;
};

// const AnimatedLight = ({ 
//   intensity = 100.0,
//   position = [5, 5, 5],
//   speedMultiplier = 10,
//   saturation = 1.0,
//   lightness = 0.5
// }) => {
//   const lightRef = useRef();
//   const hueRef = useRef(0);

//   useFrame((state, delta) => {
//     if (!lightRef.current) return;
    
//     // Update hue smoothly
//     hueRef.current += delta * speedMultiplier;
    
//     // Calculate smooth color transitions using sin waves
//     const hue = (Math.sin(hueRef.current) * 0.5 + 0.5);
    
//     // Apply the color to the light
//     lightRef.current.color.setHSL(
//       hue,
//       saturation,
//       lightness
//     );
//   });

//   return (
//     <directionalLight
//       ref={lightRef}
//       position={position}
//       intensity={intensity}
//     />
//   );
// };


const AnimanoirReal = () => {
  const sceneCreated = ({ gl }) => {
    gl.setClearColor("black", 1);
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMappingExposure = 1;
  };
  return (
    <>
      <Canvas
        onCreated={sceneCreated}
        camera={{ position: [0, 0, 10], fov: 100 }}
        style={{ width: '100%', height: '100%' }}
      >
          <Environment backgroundRotation={new THREE.Euler(0, 21, 0)} environmentIntensity={50.0} background files={"/images/animanoir-xyz-space-small.hdr"} />
          <color attach="background" args={['#060606']} />
          <DrunkenCamera fovModulation={0.06} />
          <Float speed={7}>
            <AndrosOne />
          </Float>
          <EffectComposer>
            <Vignette darkness={0.5} />
            <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.25} />
          </EffectComposer>
      </Canvas>
    </>
  );
};

export default AnimanoirReal;
