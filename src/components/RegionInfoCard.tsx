
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Globe2 } from "lucide-react";

const RegionInfoCard = ({ region, onClose, allLayers }) => {
    if (!region) return null;

    const getRegionTypeIcon = (type) => {
        switch (type) {
            case 'continent': return '🌍';
            case 'country': return '🏛️';
            case 'state': return '🏞️';
            case 'city': return '🏙️';
            default: return '📍';
        }
    };

    const getRegionTypeColor = (type) => {
        switch (type) {
            case 'continent': return 'text-purple-400';
            case 'country': return 'text-blue-400';
            case 'state': return 'text-green-400';
            case 'city': return 'text-orange-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <Card className="absolute top-4 right-4 w-80 bg-slate-900/90 backdrop-blur-sm border-slate-600 text-white animate-in fade-in-0 zoom-in-95">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl">{getRegionTypeIcon(region.type)}</span>
                            <CardTitle className="text-blue-400 text-lg">{region.name}</CardTitle>
                        </div>
                        <CardDescription className="text-slate-400">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                    <MapPin size={14} />
                                    <span>Lat: {region.lat.toFixed(2)}°, Lon: {region.lon.toFixed(2)}°</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Globe2 size={14} />
                                    <span className={getRegionTypeColor(region.type)}>
                                        {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
                                    </span>
                                    <span>in {region.continent}</span>
                                </div>
                                {region.country && region.country !== region.name && (
                                    <div className="text-xs text-slate-500">
                                        Country: {region.country}
                                    </div>
                                )}
                                {region.state && (
                                    <div className="text-xs text-slate-500">
                                        State: {region.state}
                                    </div>
                                )}
                            </div>
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-700 -mt-2 -mr-2">
                        <X size={20} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <h4 className="text-md font-semibold text-slate-300">Regional Climate Data</h4>
                    {allLayers.map(layer => (
                        <div key={layer.id} className="flex justify-between items-center text-sm p-3 bg-slate-800/60 rounded-md border border-slate-700">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">{layer.icon}</span>
                                <div>
                                    <div className="font-medium text-white">{layer.name}</div>
                                    <div className="text-xs text-slate-400">{layer.description}</div>
                                </div>
                            </div>
                            <span className="text-slate-200 font-mono text-sm bg-slate-700 px-2 py-1 rounded">
                                {region.data[layer.id] || 'N/A'}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RegionInfoCard;
