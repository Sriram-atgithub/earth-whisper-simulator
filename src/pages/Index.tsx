
import { useState } from 'react';
import EarthVisualization from '../components/EarthVisualization';
import DataPanel from '../components/DataPanel';
import ControlPanel from '../components/ControlPanel';

const Index = () => {
  const [activeLayer, setActiveLayer] = useState('temperature');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Earth Digital Twin
            </h1>
            <p className="text-slate-400 text-sm">Real-time Climate & Satellite Data Visualization</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Live Data</span>
            </div>
            <div className="text-sm text-slate-400">
              {new Date().toLocaleTimeString()} UTC
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen pt-20">
        {/* Control Panel */}
        <div className="w-80 p-6 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700">
          <ControlPanel 
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        </div>

        {/* Earth Visualization */}
        <div className="flex-1 relative">
          <EarthVisualization 
            activeLayer={activeLayer}
            onRegionSelect={setSelectedRegion}
            isPlaying={isPlaying}
          />
        </div>

        {/* Data Panel */}
        <div className="w-80 p-6 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700">
          <DataPanel 
            activeLayer={activeLayer}
            selectedRegion={selectedRegion}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/30 backdrop-blur-sm border-t border-slate-700">
        <div className="flex justify-center space-x-8 text-sm">
          <div className="text-center">
            <div className="text-blue-400 font-bold">2.3M</div>
            <div className="text-slate-400">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">47</div>
            <div className="text-slate-400">Satellites</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-bold">156ms</div>
            <div className="text-slate-400">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold">99.7%</div>
            <div className="text-slate-400">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
