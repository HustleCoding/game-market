/* eslint-disable */
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
  isPremium?: boolean; // Flag for premium vendors with enhanced visuals
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
  isPremium = false,
}: StallProps) {
  const meshRef = useRef<Mesh>(null);
  const roofRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Use stallId and vendorId in a data attribute to avoid "unused variable" warnings
  const stallData = useRef({ stallId, vendorId }).current;

  // Set isPremium automatically for the center vendor
  const isPremiumVendor = isPremium || vendorId === "mock-vendor-7";

  // Adjust particle count for premium vendors
  const effectiveParticleCount = isPremiumVendor
    ? particleCount * 2
    : particleCount;

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

      // Special treatment for premium vendors (particularly the center one)
      if (isPremiumVendor) {
        // Enhanced scale animation for premium stalls
        const premiumScaleFactor = hovered ? 1.15 : 1.05;
        meshRef.current.scale.lerp(
          new Vector3(
            scale[0] * premiumScaleFactor,
            scale[1] * premiumScaleFactor,
            scale[2] * premiumScaleFactor
          ),
          0.1
        );

        // Special floating animation for premium stalls
        meshRef.current.position.y = 0.5 + Math.sin(time * 1.5) * 0.2;

        // Pulsing roof for premium stalls
        roofRef.current.scale.y = 1 + Math.sin(time * 2) * 0.15;
        roofRef.current.rotation.y += 0.02;

        return;
      }

      // Regular scaling for non-premium stalls
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
    <group position={position} rotation={rotation} onClick={handleInteraction}>
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
      >
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          metalness={isPremiumVendor ? 0.8 : 0.5}
          roughness={isPremiumVendor ? 0.2 : 0.5}
          emissive={highlighted || isPremiumVendor ? color : "black"}
          emissiveIntensity={highlighted ? 0.5 : isPremiumVendor ? 0.3 : 0}
        />
      </mesh>

      {/* Roof */}
      <mesh ref={roofRef} receiveShadow castShadow position={[0, 2.5, 0]}>
        {getRoofGeometry()}
        <meshStandardMaterial
          color={highlighted || isPremiumVendor ? 0xffffff : color}
          transparent={true}
          opacity={0.9}
          metalness={isPremiumVendor ? 0.9 : 0.6}
          roughness={isPremiumVendor ? 0.1 : 0.4}
          emissive={highlighted || isPremiumVendor ? color : "black"}
          emissiveIntensity={highlighted ? 0.7 : isPremiumVendor ? 0.5 : 0}
        />
      </mesh>

      {/* Stall Name */}
      {showLabel && (
        <Billboard
          position={[0, isPremiumVendor ? 7 : 3.5, 0]}
          follow={true}
          lockX={true}
          lockY={true}
          lockZ={true}
        >
          <Text
            fontSize={isPremiumVendor ? 0.4 : 0.35}
            color={isPremiumVendor ? "#FFD700" : "#ffffff"}
            outlineWidth={0.02}
            outlineColor="#000000"
            maxWidth={2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        </Billboard>
      )}

      {/* Advertisement Billboard */}
      {isPremiumVendor && (
        <Billboard
          position={[0, 3.2, 0]}
          follow={true}
          lockX={true}
          lockY={true}
          lockZ={true}
        >
          <Text
            fontSize={0.3}
            color={adColor}
            maxWidth={2.5}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            {"AI-Powered Compliance"}
          </Text>
        </Billboard>
      )}

      {/* Particle effects */}
      {(highlighted || isPremiumVendor) && (
        <Sparkles
          count={effectiveParticleCount}
          scale={isPremiumVendor ? 6 : 4}
          size={isPremiumVendor ? 2 : 1.5}
          speed={0.4}
          color={getParticleColor()}
          opacity={0.7}
        />
      )}

      {/* Special billboard effect for premium vendors */}
      {isPremiumVendor && (
        <Billboard
          position={[0, 5, 0]}
          follow={true}
          lockX={true}
          lockY={true}
          lockZ={true}
        >
          <Text
            fontSize={0.5}
            color="#FFD700"
            outlineWidth={0.02}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {`✦ CompAI ✦`}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

export { StallTypes };
