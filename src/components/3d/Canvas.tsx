"use client";

import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  Bounds,
  SoftShadows,
} from "@react-three/drei";
import { Canvas as ThreeCanvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useMemo, useEffect } from "react";
import {
  Color,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
  PCFSoftShadowMap,
} from "three";

export interface CanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  enableShadows?: boolean;
}

// Performance optimization - manual control for frameloop
function SceneController() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    let animationFrameId: number;
    let isPointerDown = false;
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const renderScene = () => {
      gl.render(scene, camera);
    };

    const animate = () => {
      // Increase rendering frequency when interacting
      if (isPointerDown || isScrolling) {
        renderScene();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Trigger an initial render after a slight delay
    // This ensures the scene is visible without requiring user interaction
    setTimeout(renderScene, 100);

    // Add event listeners to prioritize rendering during interaction
    const handlePointerDown = () => {
      isPointerDown = true;
      // Force an immediate render
      renderScene();
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    // Handle wheel/scroll events for zooming
    const handleWheel = () => {
      isScrolling = true;
      // Force an immediate render
      renderScene();

      // Reset the scrolling flag after a short delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        // Render one more time after scrolling stops
        renderScene();
      }, 150);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("wheel", handleWheel);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [gl, scene, camera]);

  return null;
}

export function Canvas({
  children,
  cameraPosition = [0, 5, 15],
  cameraFov = 70,
  enableShadows = true,
}: CanvasProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);

  // Enhanced lighting and visual quality settings - memoized to prevent re-creation
  const visualSettings = useMemo(
    () => ({
      ambientIntensity: 0.5,
      sunIntensity: 1.0,
      sunColor: "#ffffff",
      skyColor: "#a4d3ff",
      groundColor: "#364422",
      fogNear: 70,
      fogFar: 180,
      shadowBias: -0.0005,
      shadowResolution: 1024, // Reduced from 2048 for better performance
      shadowRadius: 10,
    }),
    []
  );

  // Memoize camera position as Vector3
  const cameraPos = useMemo(
    () => new Vector3(...cameraPosition),
    [cameraPosition]
  );

  // Memory cleanup on component unmount
  useEffect(() => {
    const currentCamera = cameraRef.current;
    return () => {
      // Clean up any resources when component unmounts
      if (currentCamera) {
        currentCamera.clear();
      }
    };
  }, []);

  // Optimized render settings
  const glSettings = useMemo(
    () => ({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance" as const,
    }),
    []
  );

  return (
    <div className="h-full w-full">
      <ThreeCanvas
        shadows={{
          type: PCFSoftShadowMap,
          enabled: enableShadows,
        }}
        frameloop="never" // Use our custom renderer instead
        gl={glSettings}
        camera={{ position: [0, 0, 0], fov: cameraFov }}
        dpr={[1, 1.5]} // Reduced from [1, 2] for better performance
        performance={{ min: 0.5 }} // Allow ThreeJS to reduce quality if needed
        onCreated={({ gl }) => {
          gl.setClearColor(new Color(visualSettings.skyColor));
        }}
      >
        <SceneController />
        <Suspense fallback={null}>
          {/* Enable soft shadows for more realistic rendering */}
          <SoftShadows size={15} samples={8} focus={0.5} />{" "}
          {/* Reduced samples from 16 to 8 */}
          {/* Main camera */}
          <PerspectiveCamera
            makeDefault
            ref={cameraRef}
            position={cameraPos}
            fov={cameraFov}
            near={0.1}
            far={1000}
            onUpdate={(self) => {
              self.lookAt(0, 0, 0);
              self.updateProjectionMatrix();
            }}
          />
          {/* Enhanced controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.6}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={120}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2 - 0.1}
            target={[0, 0, 0]}
            dampingFactor={0.06}
            enableDamping
          />
          {/* Simplified lighting setup for better performance */}
          {/* Ambient light for base illumination */}
          <ambientLight
            intensity={visualSettings.ambientIntensity}
            color="#ffffff"
          />
          {/* Main sun directional light */}
          <directionalLight
            position={[30, 50, -30]}
            intensity={visualSettings.sunIntensity}
            color={visualSettings.sunColor}
            castShadow={enableShadows}
            shadow-mapSize-width={visualSettings.shadowResolution}
            shadow-mapSize-height={visualSettings.shadowResolution}
            shadow-camera-near={0.5}
            shadow-camera-far={180}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
            shadow-bias={visualSettings.shadowBias}
            shadow-radius={visualSettings.shadowRadius}
          />
          {/* Beautiful sky with sun positioning */}
          <Sky
            distance={450000}
            sunPosition={[30, 50, -30]}
            inclination={0.48}
            azimuth={0.25}
            turbidity={8}
            rayleigh={0.5}
          />
          {/* Scene fog for depth */}
          <fog
            attach="fog"
            args={[
              visualSettings.skyColor,
              visualSettings.fogNear,
              visualSettings.fogFar,
            ]}
          />
          {/* Scene content wrapped in bounds */}
          <Bounds fit clip observe margin={1.2}>
            {children}
          </Bounds>
        </Suspense>
      </ThreeCanvas>
    </div>
  );
}
