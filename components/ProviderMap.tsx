
import React from 'react';
import { Provider } from '../types';

interface ProviderMapProps {
  providers: Provider[];
  providerRatings: { [key: number]: { avg: number; count: number } };
  selectedProvider: Provider | null;
  onSelectProvider: (provider: Provider) => void;
}

// Define boundaries for mapping geo-coordinates to the viewbox
const MAP_BOUNDS = {
  minLat: 6.25,
  maxLat: 6.4,
  minLon: -10.88,
  maxLon: -10.70,
};

// New map background component
const MapBackground = () => (
  <div className="absolute inset-0 w-full h-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
    {/* Water */}
    <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-blue-200 dark:bg-blue-900/50 transform -skew-x-12"></div>
    {/* Main roads */}
    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200/80 dark:bg-slate-700/80"></div>
    <div className="absolute top-0 left-1/2 w-1 h-full bg-slate-200/80 dark:bg-slate-700/80"></div>
    <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-slate-200/50 dark:bg-slate-700/50"></div>
    <div className="absolute top-3/4 left-1/4 w-1/2 h-0.5 bg-slate-200/50 dark:bg-slate-700/50"></div>
    <div className="absolute top-1/4 left-3/4 w-0.5 h-1/2 bg-slate-200/50 dark:bg-slate-700/50"></div>
    {/* Map label */}
    <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-300 dark:text-slate-600 uppercase">
      Monrovia Area
    </div>
  </div>
);

const getCoordinates = (provider: Provider) => {
    if (provider.latitude === undefined || provider.longitude === undefined) {
        return null; // Don't render if no coords
    }

    const { minLat, maxLat, minLon, maxLon } = MAP_BOUNDS;

    const lat = Math.max(minLat, Math.min(maxLat, provider.latitude));
    const lon = Math.max(minLon, Math.min(maxLon, provider.longitude));

    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return null;

    return { top: `${y}%`, left: `${x}%` };
};


const ProviderMap: React.FC<ProviderMapProps> = ({ providers, providerRatings, selectedProvider, onSelectProvider }) => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
      {/* Map Background */}
      <MapBackground />
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-white/0 to-transparent dark:from-slate-800/50 dark:to-transparent"></div>

      {/* Your Location Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-5 h-5 bg-indigo-600 rounded-full shadow-lg border-4 border-white animate-pulse"></div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap">YOU ARE HERE</div>
      </div>
      
      {/* Provider Markers */}
      {providers.map(provider => {
        const ratingInfo = providerRatings[provider.id] || { avg: 0, count: 0 };
        const coords = getCoordinates(provider);
        if (!coords) return null;
        
        const photoSrc = provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=40&h=40&fit=crop&crop=face`;
        const isSelected = selectedProvider?.id === provider.id;

        return (
          <div
            key={provider.id}
            className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${isSelected ? 'z-30' : 'z-20'}`}
            style={coords}
            onClick={() => onSelectProvider(provider)}
          >
            {/* Marker Pin */}
            <div className={`w-8 h-8 rounded-full bg-white shadow-lg border-2 flex items-center justify-center transition-transform group-hover:scale-125 ${isSelected ? 'scale-125 border-amber-400' : 'border-indigo-500'}`}>
               <img 
                  src={photoSrc}
                  className="w-6 h-6 rounded-full object-cover"
                  alt={provider.name}
                />
            </div>
            
            {/* Tooltip */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-2xl shadow-2xl p-3 border border-gray-100 transition-all pointer-events-none transform group-hover:-translate-y-1 ${isSelected ? 'opacity-100 -translate-y-1' : 'opacity-0'}`}>
              <div className="flex items-center gap-3">
                <img 
                  src={photoSrc.replace('w=40&h=40', 'w=60&h=60')}
                  className="w-10 h-10 rounded-xl object-cover"
                  alt={provider.name}
                />
                <div>
                  <p className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">{provider.name}</p>
                  <p className="text-xs text-amber-600 font-bold">★ {ratingInfo.avg.toFixed(1)}</p>
                </div>
              </div>
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default ProviderMap;
