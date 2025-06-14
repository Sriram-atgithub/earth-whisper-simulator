import { Play, Pause, RotateCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ControlPanel = ({ 
  activeLayer, setActiveLayer, isPlaying, setIsPlaying,
  showSatellites, setShowSatellites, timeSpeed, setTimeSpeed, dataLayers
}) => {
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
        <div className="flex items-center space-x-3 mb-4">
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
            <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
            <div className="text-slate-400">Real-time simulation</div>
          </div>
        </div>
        <div className="space-y-2">
            <span className="text-sm text-slate-300">Simulation Speed</span>
            <ToggleGroup type="single" value={String(timeSpeed)} onValueChange={(value) => value && setTimeSpeed(Number(value))} className="w-full grid grid-cols-3 gap-2">
                <ToggleGroupItem value="1" aria-label="1x speed" className="w-full">1x</ToggleGroupItem>
                <ToggleGroupItem value="10" aria-label="10x speed" className="w-full">10x</ToggleGroupItem>
                <ToggleGroupItem value="100" aria-label="100x speed" className="w-full">100x</ToggleGroupItem>
            </ToggleGroup>
        </div>
      </div>
      
      {/* Settings */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Settings</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Show Satellites</span>
          <Switch checked={showSatellites} onCheckedChange={setShowSatellites} />
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
