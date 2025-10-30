import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

// A simple 3D mesh that rotates to provide a dynamic background
function RotatingMesh() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <icosahedronGeometry args={[1, 1]} />
      {/* Use wireframe for a high-tech, blueprints look */}
      <meshStandardMaterial color="#c0c0c0" wireframe={true} />
    </mesh>
  );
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {/* A starfield for a clean, non-distracting 3D background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <RotatingMesh />
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </>
  );
};

export default Scene;