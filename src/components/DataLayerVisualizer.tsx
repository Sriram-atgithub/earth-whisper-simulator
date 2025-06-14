
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataLayerVisualizerProps {
  activeLayer: string;
  isVisible: boolean;
}

const DataLayerVisualizer = ({ activeLayer, isVisible }: DataLayerVisualizerProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const meshRef = useRef<THREE.Group>(null);

  // Generate different visualizations for each layer
  const layerVisualization = useMemo(() => {
    const points = [];
    const colors = [];
    const sizes = [];
    
    for (let i = 0; i < 3000; i++) {
      // Distribute points on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.02 + Math.random() * 0.05;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      points.push(x, y, z);
      
      // Different colors and behaviors for each layer
      let color;
      let size;
      
      switch (activeLayer) {
        case 'temperature':
          // Temperature: Blue (cold) to Red (hot)
          const tempValue = Math.random();
          color = new THREE.Color().setHSL(0.7 - tempValue * 0.7, 1, 0.5);
          size = 0.02 + tempValue * 0.03;
          break;
          
        case 'precipitation':
          // Precipitation: Light blue to dark blue
          const precipValue = Math.random();
          color = new THREE.Color().setHSL(0.6, 1, 0.3 + precipValue * 0.4);
          size = 0.01 + precipValue * 0.04;
          break;
          
        case 'wind':
          // Wind: Green with varying intensity
          const windValue = Math.random();
          color = new THREE.Color().setHSL(0.3, 1, 0.3 + windValue * 0.5);
          size = 0.015 + windValue * 0.035;
          break;
          
        case 'clouds':
          // Clouds: White with varying opacity
          color = new THREE.Color(1, 1, 1);
          size = 0.03 + Math.random() * 0.02;
          break;
          
        case 'ocean':
          // Ocean currents: Cyan to deep blue
          const oceanValue = Math.random();
          color = new THREE.Color().setHSL(0.5, 1, 0.3 + oceanValue * 0.4);
          size = 0.02 + oceanValue * 0.03;
          break;
          
        case 'vegetation':
          // Vegetation: Yellow to green
          const vegValue = Math.random();
          color = new THREE.Color().setHSL(0.15 + vegValue * 0.15, 1, 0.4 + vegValue * 0.3);
          size = 0.015 + vegValue * 0.025;
          break;
          
        default:
          color = new THREE.Color(1, 1, 1);
          size = 0.02;
      }
      
      colors.push(color.r, color.g, color.b);
      sizes.push(size);
    }
    
    return {
      positions: new Float32Array(points),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes)
    };
  }, [activeLayer]);

  // Animation for different layers
  useFrame((state, delta) => {
    if (!pointsRef.current || !isVisible) return;
    
    const time = state.clock.elapsedTime;
    
    switch (activeLayer) {
      case 'wind':
        // Rotating wind patterns
        pointsRef.current.rotation.y += delta * 0.1;
        break;
        
      case 'clouds':
        // Floating cloud movement
        pointsRef.current.rotation.y += delta * 0.05;
        pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        break;
        
      case 'ocean':
        // Wave-like ocean current movement
        pointsRef.current.rotation.y += delta * 0.02;
        break;
        
      default:
        // Gentle rotation for other layers
        pointsRef.current.rotation.y += delta * 0.01;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={meshRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={layerVisualization.positions.length / 3}
            array={layerVisualization.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={layerVisualization.colors.length / 3}
            array={layerVisualization.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={layerVisualization.sizes.length}
            array={layerVisualization.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          size={1}
        />
      </points>
    </group>
  );
};

export default DataLayerVisualizer;
