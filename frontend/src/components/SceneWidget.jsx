import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { Color } from "three";

// This is the 3D mesh that will rotate and change color
function RotatingMesh({ beta }) {
  const meshRef = useRef();
  
  // Create color instances once
  const safeColor = useMemo(() => new Color("#06b6d4"), []); // Cyan
  const riskColor = useMemo(() => new Color("#f59e0b"), []); // Amber
  const currentColor = useMemo(() => new Color(), []);

  // useFrame allows animation on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 1. CONTROL ROTATION SPEED
      // Use beta to influence speed. Default to 1 if beta is invalid.
      const speed = isNaN(beta) ? 1 : Math.max(0.1, beta); // Ensure at least a slow spin
      meshRef.current.rotation.x += delta * 0.1 * speed;
      meshRef.current.rotation.y += delta * 0.2 * speed;

      // 2. CONTROL COLOR
      // Calculate a 'risk factor' (0 = safe, 1 = risky)
      // This maps beta values from 0.5 (safe) to 2.0 (risky)
      const lerpFactor = Math.min(Math.max((beta - 0.5) / 1.5, 0), 1);
      
      // Interpolate from safeColor to riskColor
      currentColor.copy(safeColor).lerp(riskColor, lerpFactor);
      
      // Apply the new color to the material
      meshRef.current.material.color.set(currentColor);
      // Also apply to the Edges
      meshRef.current.children[0].material.color.set(currentColor);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5, 2, 2, 2]} />
      <meshStandardMaterial color={safeColor} transparent opacity={0.1} />
      <Edges color={safeColor} threshold={15} />
    </mesh>
  );
}

const SceneWidget = ({ beta = 1.0 }) => {
  return (
    // The Canvas component from react-three-fiber
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      
      {/* Pass the beta prop down to the mesh */}
      <RotatingMesh beta={beta} />
    </Canvas>
  );
};

export default SceneWidget;

