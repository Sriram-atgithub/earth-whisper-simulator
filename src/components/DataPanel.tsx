
import { TrendingUp, TrendingDown, Minus, Activity, Globe, Thermometer } from 'lucide-react';

const DataPanel = ({ activeLayer, selectedRegion }) => {
  // Simulated data based on the active layer
  const getLayerData = () => {
    switch (activeLayer) {
      case 'temperature':
        return {
          title: 'Global Temperature',
          unit: '°C',
          current: '14.2',
          change: '+0.8',
          trend: 'up',
          description: 'Global average surface temperature'
        };
      case 'precipitation':
        return {
          title: 'Precipitation',
          unit: 'mm/day',
          current: '2.7',
          change: '-0.3',
          trend: 'down',
          description: 'Daily precipitation average'
        };
      case 'wind':
        return {
          title: 'Wind Speed',
          unit: 'm/s',
          current: '7.4',
          change: '+1.2',
          trend: 'up',
          description: 'Average wind velocity'
        };
      case 'clouds':
        return {
          title: 'Cloud Cover',
          unit: '%',
          current: '67',
          change: '0',
          trend: 'stable',
          description: 'Global cloud coverage percentage'
        };
      case 'ocean':
        return {
          title: 'Sea Temperature',
          unit: '°C',
          current: '16.8',
          change: '+0.4',
          trend: 'up',
          description: 'Ocean surface temperature'
        };
      case 'vegetation':
        return {
          title: 'Vegetation Index',
          unit: 'NDVI',
          current: '0.52',
          change: '+0.02',
          trend: 'up',
          description: 'Normalized vegetation health'
        };
      default:
        return {
          title: 'Data Layer',
          unit: '',
          current: '--',
          change: '0',
          trend: 'stable',
          description: 'Select a data layer'
        };
    }
  };

  const layerData = getLayerData();

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-red-400" size={16} />;
      case 'down':
        return <TrendingDown className="text-blue-400" size={16} />;
      default:
        return <Minus className="text-slate-400" size={16} />;
    }
  };

  const recentUpdates = [
    { time: '14:32', event: 'Hurricane system detected - Atlantic', type: 'warning' },
    { time: '14:28', event: 'Temperature spike - Arctic region', type: 'alert' },
    { time: '14:25', event: 'Satellite data synchronized', type: 'info' },
    { time: '14:20', event: 'Ocean current shift - Pacific', type: 'info' },
    { time: '14:15', event: 'Vegetation index updated', type: 'success' },
  ];

  const getEventColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-orange-400 bg-orange-500/10';
      case 'alert':
        return 'text-red-400 bg-red-500/10';
      case 'success':
        return 'text-green-400 bg-green-500/10';
      default:
        return 'text-blue-400 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Layer Data */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Current Data Layer</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {layerData.current}
              <span className="text-lg text-slate-400 ml-1">{layerData.unit}</span>
            </div>
            <div className="text-lg font-medium text-slate-300">{layerData.title}</div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {getTrendIcon(layerData.trend)}
            <span className={`text-sm ${
              layerData.trend === 'up' ? 'text-red-400' : 
              layerData.trend === 'down' ? 'text-blue-400' : 'text-slate-400'
            }`}>
              {layerData.change} {layerData.unit}
            </span>
          </div>

          <p className="text-sm text-slate-400 text-center">
            {layerData.description}
          </p>
        </div>
      </div>

      {/* Selected Region Info */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Region Analysis</h3>
        
        {selectedRegion ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-green-400" />
              <span className="text-sm text-slate-300">
                Selected: {selectedRegion.x.toFixed(2)}, {selectedRegion.y.toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400">Local Value</div>
                <div className="text-white font-semibold">
                  {(Math.random() * 20 + 10).toFixed(1)} {layerData.unit}
                </div>
              </div>
              <div className="bg-slate-700/30 p-2 rounded">
                <div className="text-slate-400">Deviation</div>
                <div className="text-orange-400 font-semibold">
                  +{(Math.random() * 5).toFixed(1)} {layerData.unit}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Click on the globe to analyze a specific region</p>
        )}
      </div>

      {/* Data Quality Metrics */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Data Quality</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Accuracy</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div className="w-[97%] h-full bg-green-500"></div>
              </div>
              <span className="text-sm text-green-400">97%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Coverage</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-blue-500"></div>
              </div>
              <span className="text-sm text-blue-400">94%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Freshness</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div className="w-[99%] h-full bg-green-500"></div>
              </div>
              <span className="text-sm text-green-400">99%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">Recent Updates</h3>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {recentUpdates.map((update, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded">
              <div className="text-xs text-slate-400 mt-1 w-12">{update.time}</div>
              <div className="flex-1">
                <div className={`text-xs px-2 py-1 rounded ${getEventColor(update.type)}`}>
                  {update.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
