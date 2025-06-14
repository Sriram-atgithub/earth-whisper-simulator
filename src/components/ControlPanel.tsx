
import { Play, Pause, RotateCcw, Settings, Info } from 'lucide-react';

const ControlPanel = ({ activeLayer, setActiveLayer, isPlaying, setIsPlaying }) => {
  const dataLayers = [
    {
      id: 'temperature',
      name: 'Temperature',
      icon: '🌡️',
      description: 'Global surface temperature patterns',
      color: 'from-blue-500 to-red-500'
    },
    {
      id: 'precipitation',
      name: 'Precipitation',
      icon: '🌧️',
      description: 'Rainfall and snow patterns',
      color: 'from-blue-600 to-blue-300'
    },
    {
      id: 'wind',
      name: 'Wind Patterns',
      icon: '💨',
      description: 'Atmospheric wind currents',
      color: 'from-green-500 to-yellow-400'
    },
    {
      id: 'clouds',
      name: 'Cloud Coverage',
      icon: '☁️',
      description: 'Global cloud formations',
      color: 'from-slate-400 to-white'
    },
    {
      id: 'ocean',
      name: 'Ocean Currents',
      icon: '🌊',
      description: 'Ocean temperature and currents',
      color: 'from-blue-800 to-cyan-400'
    },
    {
      id: 'vegetation',
      name: 'Vegetation',
      icon: '🌿',
      description: 'Plant life and biomass',
      color: 'from-green-700 to-green-300'
    }
  ];

  const satellites = [
    { name: 'GOES-16', status: 'active', dataPoints: '450K' },
    { name: 'NOAA-20', status: 'active', dataPoints: '380K' },
    { name: 'Aqua', status: 'active', dataPoints: '290K' },
    { name: 'Terra', status: 'maintenance', dataPoints: '0K' },
    { name: 'Sentinel-3A', status: 'active', dataPoints: '520K' },
  ];

  return (
    <div className="space-y-6">
      {/* Playback Controls */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Playback Controls</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="flex items-center justify-center w-10 h-10 bg-slate-600 hover:bg-slate-700 rounded-full transition-colors">
            <RotateCcw size={16} />
          </button>
          <div className="flex-1 text-sm text-slate-300">
            <div>Speed: 1x</div>
            <div className="text-slate-400">Real-time simulation</div>
          </div>
        </div>
      </div>

      {/* Data Layers */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Data Layers</h3>
        <div className="space-y-2">
          {dataLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                activeLayer === layer.id
                  ? 'bg-blue-600/30 border border-blue-500'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{layer.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-white">{layer.name}</div>
                  <div className="text-xs text-slate-400">{layer.description}</div>
                </div>
                {activeLayer === layer.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Satellite Status */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Satellite Network</h3>
        <div className="space-y-2">
          {satellites.map((satellite, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  satellite.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <span className="text-sm font-medium">{satellite.name}</span>
              </div>
              <div className="text-xs text-slate-400">{satellite.dataPoints}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">System Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Processing Rate</span>
            <span className="text-green-400">2.3M/sec</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Data Quality</span>
            <span className="text-green-400">99.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Coverage</span>
            <span className="text-blue-400">Global</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Next Update</span>
            <span className="text-slate-400">15s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
