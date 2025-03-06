"use client";

import { DoubleSide } from "three";
import { Environment as DreiEnvironment, Cloud } from "@react-three/drei";

// Define a reduced set of asset types
type EnvironmentTypeNames =
  | "pine"
  | "oak"
  | "fountain"
  | "bench"
  | "lamppost"
  | "path";
type EnvironmentType = EnvironmentTypeNames;

interface EnvironmentAssetProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  type: EnvironmentType;
  color?: string;
}

export function EnvironmentAsset({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  type,
  color,
}: EnvironmentAssetProps) {
  const normalizedScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  const components: Record<EnvironmentType, React.ReactNode> = {
    pine: (
      <group
        position={position}
        rotation={rotation}
        scale={normalizedScale as [number, number, number]}
      >
        {/* Trunk */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
          <meshStandardMaterial color="#614126" roughness={0.9} />
        </mesh>
        {/* Foliage - single cone */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.5, 4, 8]} />
          <meshStandardMaterial
            color="#1a472a"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    ),
    oak: (
      <group
        position={position}
        rotation={rotation}
        scale={normalizedScale as [number, number, number]}
      >
        {/* Trunk */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
          <meshStandardMaterial color="#5c4033" roughness={0.8} />
        </mesh>
        {/* Foliage - single sphere */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial
            color="#2e8b57"
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      </group>
    ),
    fountain: (
      <group
        position={position}
        rotation={rotation}
        scale={normalizedScale as [number, number, number]}
      >
        {/* Base */}
        <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2, 2, 1, 16]} />
          <meshStandardMaterial
            color="#a9a9a9"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
        {/* Water */}
        <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.8, 32]} />
          <meshStandardMaterial
            color="#5f9ea0"
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
      </group>
    ),
    bench: (
      <group
        position={position}
        rotation={rotation}
        scale={normalizedScale as [number, number, number]}
      >
        {/* Seat */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 0.8]} />
          <meshStandardMaterial color={color || "#8b4513"} roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.5, 0.1]} />
          <meshStandardMaterial color={color || "#8b4513"} roughness={0.7} />
        </mesh>
      </group>
    ),
    lamppost: (
      <group
        position={position}
        rotation={rotation}
        scale={normalizedScale as [number, number, number]}
      >
        {/* Post */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
        {/* Light */}
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffcc"
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          position={[0, 3, 0]}
          intensity={1}
          distance={15}
          color="#ffffaa"
          castShadow
        />
      </group>
    ),
    path: (
      <mesh position={position} rotation={rotation} receiveShadow>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial
          color="#9c8c7c"
          side={DoubleSide}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    ),
  };

  return components[type] || null;
}

export function EnvironmentDecorations() {
  const TREE_COUNT = 10;
  const BENCH_COUNT = 4;
  const LAMPPOST_COUNT = 4;
  const CLOUD_COUNT = 5;

  return (
    <>
      <group>
        {/* Central Fountain */}
        <EnvironmentAsset type="fountain" position={[0, 0, 0]} scale={1.5} />

        {/* Trees */}
        {Array.from({ length: TREE_COUNT }).map((_, i) => {
          const angle = (i / TREE_COUNT) * Math.PI * 2;
          const distance = 15 + Math.random() * 10;
          const x = Math.cos(angle) * distance;
          const z = Math.sin(angle) * distance;
          const type = Math.random() > 0.5 ? "pine" : "oak";
          const scale = 0.8 + Math.random() * 0.4;
          return (
            <EnvironmentAsset
              key={`tree-${i}`}
              type={type}
              position={[x, 0, z]}
              scale={scale}
            />
          );
        })}

        {/* Benches */}
        {Array.from({ length: BENCH_COUNT }).map((_, i) => {
          const angle = (i / BENCH_COUNT) * Math.PI * 2;
          const distance = 10;
          const x = Math.cos(angle) * distance;
          const z = Math.sin(angle) * distance;
          return (
            <EnvironmentAsset
              key={`bench-${i}`}
              type="bench"
              position={[x, 0, z]}
              rotation={[0, angle, 0]}
              scale={1}
            />
          );
        })}

        {/* Lampposts */}
        {Array.from({ length: LAMPPOST_COUNT }).map((_, i) => {
          const angle = (i / LAMPPOST_COUNT) * Math.PI * 2;
          const distance = 20;
          const x = Math.cos(angle) * distance;
          const z = Math.sin(angle) * distance;
          return (
            <EnvironmentAsset
              key={`lamppost-${i}`}
              type="lamppost"
              position={[x, 0, z]}
              scale={1.2}
            />
          );
        })}

        {/* Paths */}
        <EnvironmentAsset
          type="path"
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1}
        />
        <EnvironmentAsset
          type="path"
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          scale={1}
        />

        {/* Clouds */}
        {Array.from({ length: CLOUD_COUNT }).map((_, i) => (
          <Cloud
            key={`cloud-${i}`}
            position={[
              (Math.random() - 0.5) * 100,
              30 + Math.random() * 10,
              (Math.random() - 0.5) * 100,
            ]}
            scale={10 + Math.random() * 10}
            color="#fff"
            segments={10}
            volume={0.2}
            opacity={0.8}
            speed={0.1}
          />
        ))}
      </group>

      {/* Environment Lighting & Background */}
      <DreiEnvironment preset="park" background={true} blur={0.4} />
    </>
  );
}
