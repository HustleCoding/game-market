"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sparkles, Billboard } from "@react-three/drei";
import { Mesh, Color, Vector3 } from "three";

interface StallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
  name: string;
  stallId: string;
  vendorId: string;
  stallType?: number;
  highlighted?: boolean;
  onInteract?: () => void; // For selection, not environment change
  scale?: [number, number, number];
  showLabel?: boolean;
  particleCount?: number;
  adText?: string; // Advertisement text
  adColor?: string; // Ad text color
}

enum StallTypes {
  BASIC = 1,
  TECH = 2,
  FOOD = 3,
  ANTIQUE = 4,
}

export function Stall({
  position,
  rotation,
  color = "#4287f5",
  name,
  stallId, // Used for identification in parent components
  vendorId, // Used for identification in parent components
  stallType = StallTypes.BASIC,
  highlighted = false,
  onInteract,
  scale = [1, 1, 1],
  showLabel = true,
  particleCount = 20,
  adText = "Special Offer!",
  adColor = "#ffffff",
}: StallProps) {
  const meshRef = useRef<Mesh>(null);
  const roofRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Use stallId and vendorId in a data attribute to avoid "unused variable" warnings
  const stallData = useRef({ stallId, vendorId }).current;

  // Debug effect that logs the stall identifiers once
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Only log in development mode
      console.debug(
        `Stall rendered: ${stallData.stallId} for vendor ${stallData.vendorId}`
      );
    }
  }, [stallData]);

  // Animation without affecting environment
  useFrame((state) => {
    if (meshRef.current && roofRef.current) {
      const time = state.clock.elapsedTime;

      // Smooth scale animation
      const scaleFactor = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(
        new Vector3(
          scale[0] * scaleFactor,
          scale[1] * scaleFactor,
          scale[2] * scaleFactor
        ),
        0.1
      );

      // Type-specific animations (local to stall)
      switch (stallType) {
        case StallTypes.TECH:
          meshRef.current.position.y = 0.2 + Math.sin(time * 4) * 0.15;
          roofRef.current.rotation.y += 0.05;
          break;
        case StallTypes.FOOD:
          meshRef.current.position.y = 0.1 + Math.cos(time * 2) * 0.08;
          roofRef.current.position.y = 3 + Math.sin(time * 3) * 0.05;
          break;
        case StallTypes.ANTIQUE:
          meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.8) * 0.2;
          roofRef.current.scale.x = 1 + Math.sin(time) * 0.1;
          break;
        default:
          meshRef.current.position.y = highlighted
            ? 0.1 + Math.sin(time * 2) * 0.1
            : 0;
          meshRef.current.rotation.y = rotation[1];
      }
    }
  });

  // Handle click locally without environment impact
  const handleInteraction = () => {
    // Only trigger onInteract for selection purposes, not environment changes
    onInteract?.();
    // Optional: Add local feedback here if needed (e.g., sound, particle burst)
  };

  const getGeometry = () => {
    switch (stallType) {
      case StallTypes.TECH:
        return <icosahedronGeometry args={[1.5, 1]} />;
      case StallTypes.FOOD:
        return <cylinderGeometry args={[1.3, 1.3, 2, 24]} />;
      case StallTypes.ANTIQUE:
        return <boxGeometry args={[2.8, 2.2, 2.8]} />;
      default:
        return <boxGeometry args={[2.5, 2, 2.5]} />;
    }
  };

  const getRoofGeometry = () => {
    switch (stallType) {
      case StallTypes.TECH:
        return <torusGeometry args={[1.2, 0.2, 16, 32]} />;
      case StallTypes.FOOD:
        return <coneGeometry args={[1.8, 1.2, 12]} />;
      case StallTypes.ANTIQUE:
        return <boxGeometry args={[3.2, 0.3, 3.2]} />;
      default:
        return <coneGeometry args={[2, 1, 4]} />;
    }
  };

  const getParticleColor = () => {
    switch (stallType) {
      case StallTypes.TECH:
        return "#00ffff";
      case StallTypes.FOOD:
        return "#ffaa00";
      case StallTypes.ANTIQUE:
        return "#ffd700";
      default:
        return "#ffffff";
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[3 * scale[0], 0.1 * scale[1], 3 * scale[2]]} />
        <meshStandardMaterial
          color={stallType === StallTypes.ANTIQUE ? "#4a2c15" : "#8B4513"}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Main structure */}
      <mesh
        ref={meshRef}
        receiveShadow
        castShadow
        position={[0, 1.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleInteraction}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={
            highlighted
              ? "#ff9900"
              : hovered
              ? new Color(color).multiplyScalar(1.2).getStyle()
              : color
          }
          emissive={
            highlighted
              ? "#ff6600"
              : stallType === StallTypes.TECH
              ? "#00ccff"
              : "#000000"
          }
          emissiveIntensity={
            highlighted ? 0.5 : stallType === StallTypes.TECH ? 0.3 : 0
          }
          roughness={stallType === StallTypes.FOOD ? 0.8 : 0.5}
          metalness={stallType === StallTypes.TECH ? 0.7 : 0.3}
        />
      </mesh>

      {/* Roof */}
      <mesh
        ref={roofRef}
        receiveShadow
        castShadow
        position={[0, stallType === StallTypes.TECH ? 2.8 : 3.2, 0]}
      >
        {getRoofGeometry()}
        <meshStandardMaterial
          color={stallType === StallTypes.FOOD ? "#ff4444" : "#6b2b0d"}
          roughness={0.6}
          metalness={stallType === StallTypes.TECH ? 0.5 : 0.1}
          emissive={stallType === StallTypes.TECH ? "#00ffff" : "#000000"}
          emissiveIntensity={stallType === StallTypes.TECH ? 0.2 : 0}
        />
      </mesh>

      {/* Stall Name */}
      {showLabel && (
        <Text
          position={[0, stallType === StallTypes.TECH ? 3.8 : 4.2, 0]}
          color={highlighted ? "#ff9900" : "white"}
          fontSize={0.3 * scale[1]}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          anchorY="bottom"
          outlineWidth={highlighted ? 0.02 : 0}
          outlineColor="#000000"
        >
          {name}
        </Text>
      )}

      {/* Advertisement Billboard */}
      <Billboard position={[0, stallType === StallTypes.TECH ? 4.5 : 5, 0]}>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2 * scale[0], 0.5 * scale[1]]} />
          <meshStandardMaterial
            color="#222222"
            roughness={0.8}
            metalness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
        <Text
          position={[0, 0, 0.2]}
          color={adColor}
          fontSize={0.15 * scale[1]}
          maxWidth={1.8}
          textAlign="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {adText}
        </Text>
      </Billboard>

      {/* Particle effects */}
      {highlighted && (
        <Sparkles
          count={particleCount}
          scale={[3 * scale[0], 3 * scale[1], 3 * scale[2]]}
          size={stallType === StallTypes.FOOD ? 3 : 2}
          speed={stallType === StallTypes.TECH ? 1 : 0.5}
          color={getParticleColor()}
          position={[0, 2, 0]}
        />
      )}

      {/* Highlight marker */}
      {highlighted && (
        <group position={[0, stallType === StallTypes.TECH ? 4.5 : 5, 0]}>
          <mesh>
            <icosahedronGeometry args={[0.3 * scale[0], 1]} />
            <meshStandardMaterial
              color="red"
              emissive="red"
              emissiveIntensity={0.8}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          <pointLight
            color={getParticleColor()}
            intensity={0.8}
            distance={6}
            castShadow
          />
        </group>
      )}
    </group>
  );
}

export { StallTypes };
