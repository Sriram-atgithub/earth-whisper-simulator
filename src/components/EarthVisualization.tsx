
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Satellites = ({ timeSpeed }) => {
    const satRef = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if(satRef.current) {
            satRef.current.rotation.y += 0.05 * timeSpeed * delta;
            satRef.current.rotation.x += 0.02 * timeSpeed * delta;
        }
    });

    const sats = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 15; i++) {
            const r = 1.2 + Math.random() * 0.3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.sin(theta);
            temp.push({ id: i, position: new THREE.Vector3(x, y, z) });
        }
        return temp;
    }, []);

    return (
        <group ref={satRef}>
            {sats.map(sat => (
                <mesh key={sat.id} position={sat.position}>
                    <boxGeometry args={[0.01, 0.01, 0.02]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
}

const Earth = ({ activeLayer, onRegionSelect, isPlaying, timeSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const dataLayerRef = useRef<THREE.Points>(null);

  // Create procedural textures instead of loading external ones
  const textures = useMemo(() => {
    // Create a simple day texture (blue and green)
    const dayCanvas = document.createElement('canvas');
    dayCanvas.width = 512;
    dayCanvas.height = 256;
    const dayCtx = dayCanvas.getContext('2d');
    
    // Create a gradient for the day texture
    const dayGradient = dayCtx.createLinearGradient(0, 0, 512, 256);
    dayGradient.addColorStop(0, '#4a90e2');
    dayGradient.addColorStop(0.3, '#87ceeb');
    dayGradient.addColorStop(0.7, '#228b22');
    dayGradient.addColorStop(1, '#006400');
    dayCtx.fillStyle = dayGradient;
    dayCtx.fillRect(0, 0, 512, 256);
    
    // Add some random landmass patterns
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 20 + 5;
      dayCtx.fillStyle = '#8b4513';
      dayCtx.beginPath();
      dayCtx.arc(x, y, radius, 0, Math.PI * 2);
      dayCtx.fill();
    }
    
    const dayTexture = new THREE.CanvasTexture(dayCanvas);
    dayTexture.wrapS = THREE.RepeatWrapping;
    dayTexture.wrapT = THREE.RepeatWrapping;

    // Create a simple night texture (darker with city lights)
    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = 512;
    nightCanvas.height = 256;
    const nightCtx = nightCanvas.getContext('2d');
    
    nightCtx.fillStyle = '#001122';
    nightCtx.fillRect(0, 0, 512, 256);
    
    // Add city lights
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      nightCtx.fillStyle = `rgba(255, 255, 0, ${Math.random() * 0.8 + 0.2})`;
      nightCtx.fillRect(x, y, 1, 1);
    }
    
    const nightTexture = new THREE.CanvasTexture(nightCanvas);
    nightTexture.wrapS = THREE.RepeatWrapping;
    nightTexture.wrapT = THREE.RepeatWrapping;

    // Create cloud texture
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512;
    cloudCanvas.height = 256;
    const cloudCtx = cloudCanvas.getContext('2d');
    
    cloudCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    cloudCtx.fillRect(0, 0, 512, 256);
    
    // Add cloud patterns
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const radius = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.7 + 0.3;
      cloudCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      cloudCtx.beginPath();
      cloudCtx.arc(x, y, radius, 0, Math.PI * 2);
      cloudCtx.fill();
    }
    
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    cloudTexture.wrapS = THREE.RepeatWrapping;
    cloudTexture.wrapT = THREE.RepeatWrapping;

    return { dayTexture, nightTexture, cloudTexture };
  }, []);

  const initialRotation = useMemo(() => {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    return (utcHours / 24) * Math.PI * 2;
  }, []);

  useFrame((state, delta) => {
    if (isPlaying && meshRef.current && cloudsRef.current) {
      const rotationIncrement = (delta / 20) * timeSpeed;
      meshRef.current.rotation.y += rotationIncrement;
      cloudsRef.current.rotation.y += rotationIncrement * 1.05;
    }
  });

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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.point) {
      const { radius } = (event.object as any).geometry.parameters;
      const lat = Math.asin(event.point.y / radius) * (180 / Math.PI);
      const lon = Math.atan2(event.point.z, event.point.x) * (180 / Math.PI);

      const regionData = {
        lat,
        lon,
        name: `Region (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        data: {
          temperature: `${(Math.random() * 50 - 20).toFixed(1)}°C`,
          precipitation: `${(Math.random() * 150).toFixed(1)}mm`,
          wind: `${(Math.random() * 80).toFixed(1)} km/h`,
          clouds: `${(Math.random() * 100).toFixed(0)}%`,
          ocean: `${(Math.random() * 4).toFixed(1)} kts`,
          vegetation: `${(Math.random()).toFixed(2)} NDVI`,
        }
      };
      onRegionSelect(regionData);
    }
  };

  return (
    <group rotation={[0, initialRotation, -23.5 * Math.PI / 180]}>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          map={textures.dayTexture}
          emissiveMap={textures.nightTexture}
          emissive={new THREE.Color(0x444444)}
          shininess={100}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.005, 1.005, 1.005]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={textures.cloudTexture}
          transparent
          opacity={0.3}
          alphaMap={textures.cloudTexture}
        />
      </mesh>

      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

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

      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 0, 5]} intensity={2.5} />
    </group>
  );
};

const EarthVisualization = ({ activeLayer, onRegionSelect, isPlaying, showSatellites, timeSpeed }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <Stars radius={300} depth={50} count={5000} factor={4} />
        <Earth 
          activeLayer={activeLayer}
          onRegionSelect={onRegionSelect}
          isPlaying={isPlaying}
          timeSpeed={timeSpeed}
        />
        {showSatellites && <Satellites timeSpeed={timeSpeed} />}
        <OrbitControls 
          enablePan={false}
          minDistance={1.5}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
      
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
