
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Earth = ({ activeLayer, onRegionSelect, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const dataLayerRef = useRef<THREE.Points>(null);
  const [time, setTime] = useState(0);

  // Create Earth texture
  const earthTexture = new THREE.DataTexture(
    new Uint8Array(512 * 256 * 3),
    512,
    256,
    THREE.RGBFormat
  );

  // Fill texture data
  const data = earthTexture.image.data;
  for (let i = 0; i < data.length; i += 3) {
    const x = ((i / 3) % 512);
    const y = Math.floor((i / 3) / 512);
    const lat = (y / 256) * Math.PI - Math.PI / 2;
    const lon = (x / 512) * Math.PI * 2 - Math.PI;
    
    // Create a simple Earth-like texture
    const landMask = Math.sin(lat) * Math.cos(lon * 3) + Math.cos(lat * 2) > 0.1;
    
    if (landMask) {
      data[i] = 34;     // R - Forest green for land
      data[i + 1] = 139; // G
      data[i + 2] = 34;  // B
    } else {
      data[i] = 25;      // R - Midnight blue for oceans
      data[i + 1] = 25;  // G
      data[i + 2] = 112; // B
    }
  }
  earthTexture.needsUpdate = true;

  useFrame((state) => {
    if (isPlaying) {
      setTime(time + 0.01);
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.002;
      }
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y += 0.001;
      }
    }
  });

  // Generate climate data points based on active layer
  const generateDataPoints = () => {
    const points = [];
    const colors = [];
    
    for (let i = 0; i < 5000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.01 + Math.random() * 0.1;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      points.push(x, y, z);
      
      // Color based on active layer
      let color;
      switch (activeLayer) {
        case 'temperature':
          color = new THREE.Color().setHSL(0.7 - Math.random() * 0.7, 1, 0.5);
          break;
        case 'precipitation':
          color = new THREE.Color().setHSL(0.6, 1, 0.3 + Math.random() * 0.4);
          break;
        case 'wind':
          color = new THREE.Color().setHSL(0.3, 1, 0.3 + Math.random() * 0.4);
          break;
        case 'clouds':
          color = new THREE.Color().setHSL(0, 0, 0.7 + Math.random() * 0.3);
          break;
        default:
          color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
      }
      
      colors.push(color.r, color.g, color.b);
    }
    
    return { points: new Float32Array(points), colors: new Float32Array(colors) };
  };

  const { points, colors } = generateDataPoints();

  const handleClick = (event: THREE.Event) => {
    if (event.point) {
      onRegionSelect(event.point);
    }
  };

  return (
    <group>
      {/* Earth Sphere */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={earthTexture} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef} scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Data Layer Points */}
      <points ref={dataLayerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          vertexColors 
          size={0.02}
          transparent
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </group>
  );
};

const EarthVisualization = ({ activeLayer, onRegionSelect, isPlaying }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <Stars radius={300} depth={50} count={5000} factor={4} />
        <Earth 
          activeLayer={activeLayer}
          onRegionSelect={onRegionSelect}
          isPlaying={isPlaying}
        />
        <OrbitControls 
          enablePan={false}
          minDistance={1.5}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Layer Info Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">
          {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Data Layer
        </h3>
        <div className="text-sm text-slate-300">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Real-time updates</span>
          </div>
          <div className="text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthVisualization;
