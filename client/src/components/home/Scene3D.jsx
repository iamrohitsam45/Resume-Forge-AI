import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

function DriftingIcosahedron({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08 * speed;
      ref.current.rotation.y += delta * 0.12 * speed;
    }
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} transparent opacity={0.55} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <DriftingIcosahedron position={[-3.2, 1.4, -2]} color="#3b63f5" scale={1.1} speed={0.8} />
      <DriftingIcosahedron position={[3.4, -1.2, -3]} color="#22d3ee" scale={0.8} speed={1.1} />
      <DriftingIcosahedron position={[1.8, 2.2, -4]} color="#8b5cf6" scale={0.6} speed={1.4} />
      <Sparkles count={60} scale={[10, 6, 6]} size={2} speed={0.3} color="#93b4fd" opacity={0.6} />
    </>
  );
}

/** Subtle, lazy-loaded 3D background. Only mounted on the marketing home page. */
export function Scene3D({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene3D;
