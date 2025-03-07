/* eslint-disable */
"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Text,
  Sparkles,
  Billboard,
  Box,
  Cylinder,
  Sphere,
  Torus,
} from "@react-three/drei";
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
  stallId,
  vendorId,
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
  const signRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Use stallId and vendorId in a data attribute to avoid "unused variable" warnings
  const stallData = useRef({ stallId, vendorId }).current;

  // Special handling for premium AI vendors
  const isAIVendor =
    vendorId === "mock-vendor-8" || vendorId === "mock-vendor-7";
  const effectiveScale: [number, number, number] = isAIVendor
    ? [1.5, 2, 1.5]
    : scale;
  const effectiveParticleCount = isAIVendor ? particleCount * 2 : particleCount;
  const isPremiumVendor = isPremium || isAIVendor;

  // Get vendor-specific color
  const getVendorColor = () => {
    if (vendorId === "mock-vendor-8") return "#6366f1"; // Softgen AI color
    if (vendorId === "mock-vendor-7") return "#0066ff"; // Comp AI color
    return color;
  };

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

      // Animate the sign if it exists
      if (signRef.current && isAIVendor) {
        signRef.current.rotation.y = time * 0.2;
        signRef.current.position.y = 9 + Math.sin(time * 0.8) * 0.3;
      }

      // Special treatment for premium vendors (particularly the center one)
      if (isPremiumVendor) {
        // Enhanced scale animation for premium stalls
        const premiumScaleFactor = hovered ? 1.15 : 1.05;
        meshRef.current.scale.lerp(
          new Vector3(
            effectiveScale[0] * premiumScaleFactor,
            effectiveScale[1] * premiumScaleFactor,
            effectiveScale[2] * premiumScaleFactor
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
          effectiveScale[0] * scaleFactor,
          effectiveScale[1] * scaleFactor,
          effectiveScale[2] * scaleFactor
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
    // Special geometry for Comp AI - Modern Corporate Skyscraper
    if (vendorId === "mock-vendor-7") {
      return (
        <group>
          {/* Main tower structure */}
          <Box args={[3, 6, 3]} position={[0, 2, 0]}>
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
              emissive={new Color(color).multiplyScalar(0.1)}
            />
          </Box>

          {/* Glass curtain walls - all sides */}
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation, idx) => (
            <group
              key={`wall-${idx}`}
              rotation={[0, rotation, 0]}
              position={[0, 2, 1.51]}
            >
              {/* Grid of windows */}
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 3 }).map((_, col) => (
                  <Box
                    key={`window-${row}-${col}`}
                    args={[0.8, 0.9, 0.1]}
                    position={[(col - 1) * 0.9, row * 1.1 - 2, 0]}
                  >
                    <meshStandardMaterial
                      color="#88ccff"
                      metalness={1}
                      roughness={0}
                      transparent={true}
                      opacity={0.3}
                    />
                  </Box>
                ))
              )}
            </group>
          ))}

          {/* Corner pillars */}
          {[
            [-1.5, -1.5],
            [-1.5, 1.5],
            [1.5, -1.5],
            [1.5, 1.5],
          ].map(([x, z]) => (
            <group key={`pillar-${x}-${z}`}>
              <Box args={[0.3, 6, 0.3]} position={[x, 2, z]}>
                <meshStandardMaterial
                  color="#0044cc"
                  metalness={0.9}
                  roughness={0.2}
                />
              </Box>
              {/* Pillar details */}
              {[0, 1, 2, 3, 4].map((y) => (
                <Box
                  key={`detail-${y}`}
                  args={[0.4, 0.1, 0.4]}
                  position={[x, y, z]}
                >
                  <meshStandardMaterial
                    color="#0066ff"
                    metalness={1}
                    roughness={0}
                    emissive={new Color("#0066ff").multiplyScalar(0.3)}
                  />
                </Box>
              ))}
            </group>
          ))}

          {/* ENHANCED: Company name signs on multiple sides - MUCH LARGER */}
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, idx) => (
            <group
              key={`sign-${idx}`}
              rotation={[0, angle, 0]}
              position={[0, 4, 1.55]}
            >
              {/* Larger sign background with glow */}
              <Box args={[2.8, 0.8, 0.15]}>
                <meshStandardMaterial
                  color="#0066ff"
                  metalness={1}
                  roughness={0}
                  emissive={new Color("#0066ff")}
                />
              </Box>
              {/* Larger, bolder text */}
              <Text
                position={[0, 0, 0.08]}
                fontSize={0.7}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.15}
                outlineColor="#000033"
              >
                COMP AI
              </Text>
            </group>
          ))}

          {/* Base with lighting */}
          <Box args={[4, 0.2, 4]} position={[0, -0.4, 0]}>
            <meshStandardMaterial
              color="#333333"
              metalness={0.7}
              roughness={0.3}
            />
          </Box>

          {/* Entrance */}
          <group position={[0, 0, 1.5]}>
            <Box args={[2, 3, 0.2]}>
              <meshStandardMaterial
                color="#0044cc"
                metalness={0.9}
                roughness={0.2}
              />
            </Box>
            <Cylinder args={[0.6, 0.6, 2, 16]} position={[0, -0.5, 0.1]}>
              <meshStandardMaterial
                color="#88ccff"
                metalness={1}
                roughness={0}
                transparent={true}
                opacity={0.3}
              />
            </Cylinder>
          </group>
        </group>
      );
    }

    // Special geometry for Softgen AI - Modern Tech Campus
    if (vendorId === "mock-vendor-8") {
      return (
        <group>
          {/* Main building structure */}
          <Cylinder args={[2, 2.2, 4, 32]} position={[0, 1.5, 0]}>
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.2}
              emissive={new Color(color).multiplyScalar(0.1)}
            />
          </Cylinder>

          {/* Glass panels */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const x = Math.cos(angle) * 2.2;
            const z = Math.sin(angle) * 2.2;
            return (
              <group
                key={`panel-section-${i}`}
                position={[x, 1.5, z]}
                rotation={[0, angle, 0]}
              >
                {[-1, 0, 1].map((y) => (
                  <Box
                    key={`panel-${i}-${y}`}
                    args={[1, 0.9, 0.05]}
                    position={[0, y * 1.1, 0]}
                  >
                    <meshStandardMaterial
                      color="#aaddff"
                      metalness={1}
                      roughness={0}
                      transparent={true}
                      opacity={0.3}
                    />
                  </Box>
                ))}
              </group>
            );
          })}

          {/* ENHANCED: Company name signs - MUCH LARGER */}
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, idx) => (
            <group
              key={`sign-${idx}`}
              rotation={[0, angle, 0]}
              position={[0, 3, 2.35]}
            >
              {/* Larger sign background with enhanced glow effect */}
              <Box args={[2.5, 0.7, 0.15]}>
                <meshStandardMaterial
                  color="#6366f1"
                  metalness={1}
                  roughness={0}
                  emissive={new Color("#6366f1")}
                />
              </Box>
              {/* Larger, bolder text with enhanced outlines */}
              <Text
                position={[0, 0, 0.08]}
                fontSize={0.55}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.15}
                outlineColor="#1e1b4b"
              >
                SOFTGEN AI
              </Text>
            </group>
          ))}

          {/* Base with lighting ring */}
          <Cylinder args={[2.8, 3, 0.3, 32]} position={[0, -0.4, 0]}>
            <meshStandardMaterial
              color="#333333"
              metalness={0.7}
              roughness={0.3}
            />
          </Cylinder>
          <Torus args={[2.6, 0.1, 32, 32]} position={[0, -0.24, 0]}>
            <meshStandardMaterial
              color="#6366f1"
              emissive={new Color("#6366f1")}
              metalness={1}
              roughness={0}
            />
          </Torus>

          {/* Modern entrance */}
          <group position={[0, 0, 2.4]}>
            <Box args={[3, 3, 0.2]}>
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            <Box args={[2, 2.2, 0.1]} position={[0, -0.3, 0.1]}>
              <meshStandardMaterial
                color="#aaddff"
                metalness={1}
                roughness={0}
                transparent={true}
                opacity={0.4}
              />
            </Box>
          </group>
        </group>
      );
    }

    // Default geometries for other vendors
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
    // Special roof for Comp AI - Corporate Crown
    if (vendorId === "mock-vendor-7") {
      return (
        <group position={[0, 4.5, 0]}>
          {/* Main crown structure */}
          <mesh>
            <cylinderGeometry args={[1.5, 1.2, 1, 8]} />
            <meshStandardMaterial
              color="#0044cc"
              metalness={0.9}
              roughness={0.1}
              emissive={new Color("#0044cc").multiplyScalar(0.3)}
            />
          </mesh>

          {/* Top spire */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshStandardMaterial
              color="#0066ff"
              metalness={1}
              roughness={0}
              emissive={new Color("#0066ff").multiplyScalar(0.5)}
            />
          </mesh>

          {/* Crown lights */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh
                key={`light-${i}`}
                position={[Math.cos(angle) * 1.3, 0.5, Math.sin(angle) * 1.3]}
              >
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial
                  color="#0066ff"
                  metalness={1}
                  roughness={0}
                  emissive={new Color("#0066ff")}
                />
              </mesh>
            );
          })}
        </group>
      );
    }

    // Special roof for Softgen AI - Tech Dome
    if (vendorId === "mock-vendor-8") {
      return (
        <group position={[0, 3.5, 0]}>
          {/* Main dome */}
          <mesh>
            <sphereGeometry args={[2, 32, 16]} />
            <meshStandardMaterial
              color="#4338ca"
              metalness={0.8}
              roughness={0.2}
              transparent={true}
              opacity={0.6}
              emissive={new Color("#4338ca").multiplyScalar(0.3)}
            />
          </mesh>

          {/* Dome structure rings */}
          {[0, 1].map((y) => (
            <mesh key={`dome-ring-${y}`} position={[0, y * 0.8 - 0.8, 0]}>
              <torusGeometry args={[2, 0.1, 16, 32]} />
              <meshStandardMaterial
                color="#6366f1"
                metalness={1}
                roughness={0}
                emissive={new Color("#6366f1").multiplyScalar(0.4)}
              />
            </mesh>
          ))}

          {/* Central spire */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.1, 0.05, 1.5, 8]} />
            <meshStandardMaterial
              color="#6366f1"
              metalness={1}
              roughness={0}
              emissive={new Color("#6366f1").multiplyScalar(0.5)}
            />
          </mesh>
        </group>
      );
    }

    // Default roof geometries
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
    <group
      position={position}
      rotation={rotation}
      scale={effectiveScale}
      onClick={handleInteraction}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base structure */}
      <mesh ref={meshRef} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          metalness={isAIVendor ? 0.8 : 0.5}
          roughness={isAIVendor ? 0.2 : 0.5}
          emissive={
            isAIVendor
              ? new Color(color).multiplyScalar(0.2)
              : new Color(0x000000)
          }
        />
      </mesh>

      {/* Roof */}
      <mesh ref={roofRef} position={[0, 2, 0]} castShadow>
        {getRoofGeometry()}
        <meshStandardMaterial
          color={isAIVendor ? "#8B4513" : color}
          metalness={isAIVendor ? 0.6 : 0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Special features for AI vendors */}
      {isAIVendor && (
        <>
          {/* Additional decorative elements */}
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color={getVendorColor()}
              metalness={0.9}
              roughness={0.1}
              emissive={new Color(getVendorColor()).multiplyScalar(0.3)}
            />
          </mesh>

          {/* Enhanced Floating rings */}
          <group position={[0, 4, 0]}>
            <mesh>
              <torusGeometry args={[1.5, 0.08, 16, 32]} />
              <meshStandardMaterial
                color={getVendorColor()}
                metalness={0.9}
                roughness={0.1}
                emissive={new Color(getVendorColor()).multiplyScalar(0.8)}
              />
            </mesh>
          </group>

          {/* ENHANCED: Large rotating sign above the building */}
          <group ref={signRef} position={[0, 9, 0]}>
            <Billboard follow={true}>
              <Box args={[4.5, 1.2, 0.05]}>
                <meshStandardMaterial
                  color={getVendorColor()}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={new Color(getVendorColor()).multiplyScalar(0.5)}
                  transparent={true}
                  opacity={0.8}
                />
              </Box>
              <Text
                position={[0, 0, 0.1]}
                fontSize={0.9}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.2}
                outlineColor={
                  vendorId === "mock-vendor-8" ? "#1e1b4b" : "#000066"
                }
              >
                {vendorId === "mock-vendor-8" ? "SOFTGEN AI" : "COMP AI"}
              </Text>
            </Billboard>
          </group>
        </>
      )}

      {/* Labels and effects */}
      {showLabel && (
        <Billboard
          position={[0, isAIVendor ? 8 : isPremiumVendor ? 7 : 3.5, 0]}
          follow={true}
          lockX={true}
          lockY={true}
          lockZ={true}
        >
          {/* Enhanced label for AI vendors */}
          {isAIVendor ? (
            <group>
              {/* Glowing background panel */}
              <Box args={[4, 1.2, 0.05]}>
                <meshStandardMaterial
                  color={getVendorColor()}
                  metalness={1}
                  roughness={0}
                  emissive={new Color(getVendorColor()).multiplyScalar(0.5)}
                  transparent={true}
                  opacity={0.8}
                />
              </Box>
              {/* Larger text with stronger outline */}
              <Text
                fontSize={0.8}
                color="#ffffff"
                outlineWidth={0.15}
                outlineColor={
                  vendorId === "mock-vendor-8" ? "#1e1b4b" : "#000066"
                }
                maxWidth={3.5}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
              >
                {name}
              </Text>
            </group>
          ) : (
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
          )}
        </Billboard>
      )}

      {/* Advertisement Billboard - Enhanced */}
      {(isPremiumVendor || isAIVendor) && (
        <Billboard
          position={[0, isAIVendor ? 6.5 : 3.2, 0]}
          follow={true}
          lockX={true}
          lockY={true}
          lockZ={true}
        >
          {isAIVendor ? (
            <group>
              {/* Background for ad text - more pronounced */}
              <Box args={[4, 0.8, 0.05]}>
                <meshStandardMaterial
                  color={vendorId === "mock-vendor-8" ? "#4338ca" : "#003399"}
                  metalness={0.8}
                  roughness={0.2}
                  transparent={true}
                  opacity={0.7}
                />
              </Box>
              <Text
                fontSize={0.5}
                color="#ffffff"
                maxWidth={3.5}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000000"
              >
                {vendorId === "mock-vendor-8"
                  ? "AI Web App Developer"
                  : vendorId === "mock-vendor-7"
                  ? "AI-Powered Compliance"
                  : adText}
              </Text>
            </group>
          ) : (
            <Text
              fontSize={0.3}
              color={adColor}
              maxWidth={2.5}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              {adText}
            </Text>
          )}
        </Billboard>
      )}

      {/* Enhanced particle effects */}
      {(highlighted || isPremiumVendor || isAIVendor) && (
        <Sparkles
          count={effectiveParticleCount * 1.5}
          scale={isAIVendor ? 10 : isPremiumVendor ? 7 : 4}
          size={isAIVendor ? 2.5 : isPremiumVendor ? 2 : 1.5}
          speed={0.4}
          color={isAIVendor ? getVendorColor() : getParticleColor()}
          opacity={0.8}
        />
      )}
    </group>
  );
}

export { StallTypes };
