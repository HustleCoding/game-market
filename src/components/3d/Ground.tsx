"use client";

import { useRef, useMemo } from "react";
import { Mesh, TextureLoader, RepeatWrapping, Vector2 } from "three";
import { useLoader } from "@react-three/fiber";

interface GroundProps {
  size?: [number, number];
  position?: [number, number, number];
  color?: string;
  enableTexture?: boolean;
  receiveShadow?: boolean;
}

export function Ground({
  size = [300, 300],
  position = [0, 0, 0],
  color = "#4caf50",
  enableTexture = true,
  receiveShadow = true,
}: GroundProps) {
  const meshRef = useRef<Mesh>(null);

  // Load textures at the top level of the component
  // We'll provide a fallback in case enableTexture is false
  const textureUrls = enableTexture
    ? [
        "/textures/normal.jpg", // Diffuse map
        "/textures/grass.jpg", // Normal map
      ]
    : [];

  // This will return an empty array if textureUrls is empty
  const textures = useLoader(TextureLoader, textureUrls, undefined, () => {
    console.log("Texture loader initialized");
  });

  // Determine grassTexture and normalMap based on loaded textures
  const grassTexture =
    enableTexture && textures.length > 0 ? textures[0] : null;
  const normalMap = enableTexture && textures.length > 1 ? textures[1] : null;

  // Configure texture properties with fallback
  const textureProps = useMemo(() => {
    if (!enableTexture || !grassTexture || !normalMap) {
      console.warn("Textures not available, falling back to basic material");
      return {};
    }

    try {
      // Configure diffuse texture
      grassTexture.repeat.set(10, 10);
      grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
      grassTexture.anisotropy = 4;

      // Configure normal map
      normalMap.repeat.set(10, 10);
      normalMap.wrapS = normalMap.wrapT = RepeatWrapping;
      normalMap.anisotropy = 4;

      return {
        map: grassTexture,
        normalMap: normalMap,
        normalScale: new Vector2(0.5, 0.5),
      };
    } catch (error) {
      console.warn("Texture configuration failed, using fallback:", error);
      return {};
    }
  }, [grassTexture, normalMap, enableTexture]);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow={receiveShadow}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
        envMapIntensity={0.5}
        {...textureProps}
      />
    </mesh>
  );
}
