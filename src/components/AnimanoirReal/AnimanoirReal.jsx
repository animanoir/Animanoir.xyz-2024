import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import useLastFmData from '../hooks/useLastFmData';
import { Environment, Float, Html } from '@react-three/drei';


const AnimanoirReal = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planeRef = useRef(null);
  const controlsRef = useRef(null);
  const lfmData = useLastFmData();
  const mixerRef = useRef(null);
  const composerRef = useRef(null);
  const cameraRef = useRef(null);
  const [isDrunk, setIsDrunk] = useState(true);
  const [fovModulation, setFovModulation] = useState(0.05);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer();
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#060606'); // Set background color
    mountRef.current.appendChild(renderer.domElement);

    // // Add OrbitControls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controlsRef.current = controls;
    // controls.enableDamping = true; // Add smooth damping effect
    // controls.dampingFactor = 0.05;

    // Create a plane instead of a cube
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    planeRef.current = plane;
    plane.position.z = -10; // Position the plane farther from the camera
    scene.add(plane);

    // Load 3D model
    const loader = new FBXLoader();
    loader.load('/andros-baile-general-lento.fbx', (fbx) => {
      // Scale down the model if it's too large
      fbx.scale.setScalar(0.05);
      scene.add(fbx);

      // Set up animation
      const mixer = new THREE.AnimationMixer(fbx);
      mixerRef.current = mixer;
      const action = mixer.clipAction(fbx.animations[0]);
      action.play();

      // Center the model
      const box = new THREE.Box3().setFromObject(fbx);
      const center = box.getCenter(new THREE.Vector3());
      fbx.position.sub(center);
    }, undefined, (error) => {
      console.error('An error happened while loading the FBX file:', error);
    });

    // Set up lighting
    const light = new THREE.PointLight(0xffffff, 100, 1000); // Increase intensity and range
    light.position.set(0, 0, 5);
    scene.add(light);

    // Set up EffectComposer and FilmPass
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const filmPass = new FilmPass(
      0.35,  // noise intensity
      0.025, // scanline intensity
      648,   // scanline count
      false  // grayscale
    );
    composer.addPass(filmPass);

    // Drunken camera parameters
    const drunkMagnitude = 0.09;
    const drunkSpeed = 0.0035;

    // FOV modulation parameters
    const baseFOV = 80;
    const fovAmplitude = 220; // Adjust this to change the intensity of the effect
    const fovFrequency = 0.0023; // Adjust this to change the speed of the effect

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls only when not drunk
      // if (!isDrunk && controlsRef.current) {
      //   controlsRef.current.update();
      // }

      // Update mixer
      if (mixerRef.current) {
        mixerRef.current.update(0.023); // Assuming 60fps
      }

      // Rotate the plane slowly
      if (planeRef.current) {
        planeRef.current.rotation.y += 0.01;
      }

      // Apply drunken camera effect
      if (isDrunk && cameraRef.current) {
        const time = Date.now() * drunkSpeed;
        cameraRef.current.rotation.x = Math.sin(time) * drunkMagnitude;
        cameraRef.current.rotation.y = Math.cos(time * 0.5) * drunkMagnitude;
        cameraRef.current.rotation.z = Math.sin(time * 0.3) * drunkMagnitude;
      }

      // Modulate FOV
      const newFOV = baseFOV + Math.sin(Date.now() * fovFrequency) * fovAmplitude * fovModulation;
      camera.fov = newFOV;
      camera.updateProjectionMatrix();

      // Render with EffectComposer
      composer.render();
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (composerRef.current) {
        composerRef.current.dispose();
      }
    };
  }, [isDrunk, fovModulation]);

  useEffect(() => {
    if (lfmData.recenttracks?.track?.[0]?.image && planeRef.current) {
      const albumImageUrl = lfmData.recenttracks.track[0].image[3]['#text'];
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(albumImageUrl, (texture) => {
        // Create a new material with the loaded texture
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide
        });

        // Apply the new material to the plane
        planeRef.current.material = material;
      });
    }
  }, [lfmData]);

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default AnimanoirReal;
