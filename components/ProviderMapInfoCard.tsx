
import React from 'react';
import { Provider } from '../types';
import StarRating from './StarRating';

interface ProviderMapInfoCardProps {
    provider: Provider | null;
    ratingInfo?: { avg: number; count: number };
    isFavorited: boolean;
    onViewProfile: (p: Provider) => void;
    onBook: (p: Provider) => void;
    onToggleFavorite: (type: 'provider', id: number) => void;
}

const ProviderMapInfoCard: React.FC<ProviderMapInfoCardProps> = ({ provider, ratingInfo, isFavorited, onViewProfile, onBook, onToggleFavorite }) => {

    if (!provider) {
        return (
            <div className="h-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-gray-800">Select a Provider</h3>
                <p className="text-gray-500 mt-2">Click a pin on the map to see details about a service provider.</p>
            </div>
        );
    }
    
    const photoSrc = provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=200&h=200&fit=crop&crop=face`;

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col animate-fade-in h-full">
            <div className="flex items-center gap-4 mb-4">
                <img src={photoSrc} alt={provider.name} className="w-20 h-20 rounded-2xl object-cover"/>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                    <p className="text-sm text-gray-500 font-medium capitalize">{provider.category.replace('-', ' ')}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                {ratingInfo && ratingInfo.count > 0 && (
                    <div className="flex items-center gap-2">
                        <StarRating rating={ratingInfo.avg} />
                        <span className="text-sm font-bold text-gray-600">{ratingInfo.avg.toFixed(1)}</span>
                        <span className="text-sm text-gray-400">({ratingInfo.count} reviews)</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {provider.distance}
                </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{provider.bio}</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {provider.specialties.slice(0, 3).map(spec => (
                    <span key={spec} className="bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border border-indigo-100">
                    {spec}
                    </span>
                ))}
            </div>
            
            <div className="mt-auto space-y-3">
                <div className="flex gap-3">
                    <button 
                        onClick={() => onViewProfile(provider)}
                        className="flex-1 py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        View Profile
                    </button>
                     <button 
                        onClick={() => onToggleFavorite('provider', provider.id)}
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl"
                    >
                         <svg className={`w-6 h-6 transition-all duration-300 ${isFavorited ? 'text-rose-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
                        </svg>
                    </button>
                </div>
                 <button 
                    onClick={() => onBook(provider)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    Book Now
                </button>
            </div>

        </div>
    );
};

export default ProviderMapInfoCard;
