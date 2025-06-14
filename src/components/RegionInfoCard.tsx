
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const RegionInfoCard = ({ region, onClose, allLayers }) => {
    if (!region) return null;

    return (
        <Card className="absolute top-4 right-4 w-80 bg-slate-900/80 backdrop-blur-sm border-slate-600 text-white animate-in fade-in-0 zoom-in-95">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-blue-400">{region.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                            Lat: {region.lat.toFixed(2)}°, Lon: {region.lon.toFixed(2)}°
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-700 -mt-2 -mr-2">
                        <X size={20} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <h4 className="text-md font-semibold text-slate-300">Live Data Layers</h4>
                    {allLayers.map(layer => (
                        <div key={layer.id} className="flex justify-between items-center text-sm p-2 bg-slate-800/50 rounded-md">
                            <div className="flex items-center space-x-2">
                                <span>{layer.icon}</span>
                                <span className="font-medium">{layer.name}</span>
                            </div>
                            <span className="text-slate-300">{region.data[layer.id] || 'N/A'}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RegionInfoCard;
