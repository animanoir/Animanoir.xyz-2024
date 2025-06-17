import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three"; // Import THREE

export function AndrosFetal(props) {
  const group = useRef();
  const eyeMaterialRef = useRef(); // Ref for the eye material
  const bodyMaterialRef = useRef(); // Ref for the body material
  const [isTransparent, setIsTransparent] = useState(true); // State for transparency/metalness toggle
  
  // Mouse rotation states
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [rotationVelocity, setRotationVelocity] = useState({ x: 0, y: 0 });
  const { gl } = useThree();

  const handleBodyClick = () => {
    setIsTransparent(!isTransparent); // Toggle the state
  };

  // Mouse event handlers for rotation
  const handleMouseDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
    setRotationVelocity({ x: 0, y: 0 }); // Stop current rotation velocity
    gl.domElement.style.cursor = 'grabbing';
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;
    
    // Apply rotation based on mouse movement
    const rotationSpeed = 0.005;
    if (group.current) {
      group.current.rotation.y += deltaX * rotationSpeed;
      group.current.rotation.x += deltaY * rotationSpeed;
    }
    
    // Set velocity for damping
    setRotationVelocity({
      x: deltaY * rotationSpeed * 0.1,
      y: deltaX * rotationSpeed * 0.1
    });
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, lastMousePos]);

  // Set cursor style
  useEffect(() => {
    gl.domElement.style.cursor = 'grab';
    
    return () => {
      gl.domElement.style.cursor = 'default';
    };
  }, [gl]);

  // Update material properties based on the state
  useEffect(() => {
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.metalness = isTransparent ? 0.0 : 1.0;
      // You might want to adjust other properties like transmission or opacity here too
      bodyMaterialRef.current.transmission = isTransparent ? 1.0 : 0.0; // Example
      bodyMaterialRef.current.opacity = isTransparent ? 0.5 : 1.0; // Example
    }
  }, [isTransparent]); // Re-run effect when isTransparent changes

  useFrame((state, delta) => {
    // Bobbing animation
    group.current.position.y = group.current.position.y +=
      Math.sin(state.clock.getElapsedTime()) * 0.1 * 0.05;

    // Apply damping to rotation when not dragging
    if (!isDragging && group.current) {
      // Apply velocity to rotation
      group.current.rotation.x += rotationVelocity.x;
      group.current.rotation.y += rotationVelocity.y;
      
      // Apply damping (reduce velocity over time)
      const dampingFactor = 0.95;
      setRotationVelocity(prev => ({
        x: prev.x * dampingFactor,
        y: prev.y * dampingFactor
      }));
      
      // Stop very small velocities to prevent infinite rotation
      if (Math.abs(rotationVelocity.x) < 0.001 && Math.abs(rotationVelocity.y) < 0.001) {
        setRotationVelocity({ x: 0, y: 0 });
      }
    }

    // Eye color change based on mouse
    if (eyeMaterialRef.current) {
      const mouseX = state.mouse.x;
      const mouseY = state.mouse.y;

      // Map mouse coordinates to HSL values
      // Hue based on X, Lightness based on Y
      const hue = THREE.MathUtils.mapLinear(mouseX, -1, 1, 0, 1); // Full hue range
      const lightness = THREE.MathUtils.mapLinear(mouseY, -1, 1, 0.3, 0.8); // Adjust lightness range

      // Create a new color and set HSL
      const newColor = new THREE.Color();
      newColor.setHSL(hue, 1.0, lightness); // Saturation = 1.0

      // Smoothly interpolate the current color towards the new color
      eyeMaterialRef.current.color.lerp(newColor, delta * 5); // Adjust lerp speed (5) as needed
      // Also update emissive color to match
      eyeMaterialRef.current.emissive.copy(eyeMaterialRef.current.color);
    }
  });

  const { nodes, animations } = useGLTF("./andros_fetal.glb");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions.Fetal.play();
  }, [actions]); // Add actions to dependency array

  return (
    <group
      scale={[0.1, 0.1, 0.1]}
      position={[0, 0, 0]}
      rotation={[0, 1.2, 0]}
      ref={group}
      {...props}
      dispose={null}
      onPointerDown={handleMouseDown}
    >
      <group name="Scene">
        <group name="Cuerpo" >
          <primitive object={nodes.CC_Base_Hip} />
          <skinnedMesh
            name="CC_Base_Body"
            geometry={nodes.CC_Base_Body.geometry}
            skeleton={nodes.CC_Base_Body.skeleton}
            onClick={handleBodyClick}
          >
            {/* Assign ref to the material */}
            <meshPhysicalMaterial
              ref={bodyMaterialRef} // Add ref here
              color="#7997A1"
              metalness={1.0} // Initial metalness
              roughness={0.0}
              transmission={1.0}
              thickness={0.5}
              ior={5.417}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1}
            />
          </skinnedMesh>
          <skinnedMesh
            name="CC_Base_Eye"
            geometry={nodes.CC_Base_Eye.geometry}
            skeleton={nodes.CC_Base_Eye.skeleton}
          >
            {/* Assign the ref to the material */}
            <meshPhysicalMaterial
              ref={eyeMaterialRef}
              color="#FFF" // Initial color
              emissive="#FFF" // Initial emissive
              emissiveIntensity={20.0}
            />
          </skinnedMesh>
        </group>
      </group>
    </group>
  );
}

export default AndrosFetal;

useGLTF.preload("./andros_fetal.glb");