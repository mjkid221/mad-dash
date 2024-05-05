/* eslint-disable react/no-unknown-property -- allow */
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import {
  Vector3,
  BufferGeometry,
  BufferAttribute,
  TextureLoader,
  DoubleSide,
  Mesh,
} from "three";

const ModelPlane = ({ imgSrc }: { imgSrc: string }) => {
  const meshRef = useRef<Mesh>(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useFrame(() => {
    if (shouldAnimate && meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => setShouldAnimate(false), 1850);
    return () => clearTimeout(timeoutId);
  }, []);

  const texture = useLoader(TextureLoader, imgSrc);
  const geometry = new BufferGeometry();
  const vertices = [
    new Vector3(-1, -1, 0),
    new Vector3(1, -1, 0),
    new Vector3(1, 1, 0),
    new Vector3(-1, 1, 0),
  ];
  const positions = new Float32Array(vertices.length * 3);

  for (let i = 0; i < vertices.length; i++) {
    positions[i * 3] = vertices[i].x;
    positions[i * 3 + 1] = vertices[i].y;
    positions[i * 3 + 2] = vertices[i].z;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  return (
    <mesh ref={meshRef} position={[0, 0, 1]} rotation={[0, -Math.PI / 20, 0]}>
      <planeGeometry attach="geometry" args={[6, 6]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

export const ArBadge = ({ imgSrc }: { imgSrc: string }) => (
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <ModelPlane imgSrc={imgSrc} />
    <OrbitControls />
  </Canvas>
);
