
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Provider, Availability, FavoriteItem, Review } from '../types';
import ProviderMap from './ProviderMap';
import ProviderMapInfoCard from './ProviderMapInfoCard';
import StarRating from './StarRating';

interface ProviderListProps {
  category: string;
  providers: Provider[];
  reviews: Review[];
  favorites: FavoriteItem[];
  onToggleFavorite: (type: 'provider' | 'product', id: number) => void;
  onBook: (p: Provider) => void;
  onViewProfile: (p: Provider) => void;
}

type PriceFilter = 'all' | 'under50' | '50-100' | 'over100';
type DistanceFilter = 'all' | '1' | '2' | '5';
type AvailabilityFilter = 'all' | Availability;
type SortOption = 'default' | 'rating' | 'price' | 'distance';

const ProviderList: React.FC<ProviderListProps> = ({ category, providers, reviews, favorites, onToggleFavorite, onBook, onViewProfile }) => {
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');
  const [maxDistance, setMaxDistance] = useState<DistanceFilter>('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedMapProvider, setSelectedMapProvider] = useState<Provider | null>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const providerRatings = useMemo(() => {
    const ratings: { [key: number]: { avg: number; count: number } } = {};
    providers.forEach(p => {
        const relevantReviews = reviews.filter(r => r.providerId === p.id);
        const count = relevantReviews.length;
        const avg = count > 0 ? relevantReviews.reduce((acc, r) => acc + r.rating, 0) / count : 0;
        ratings[p.id] = { avg, count };
    });
    return ratings;
  }, [providers, reviews]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // When filters change, deselect provider on map
  useEffect(() => {
    setSelectedMapProvider(null);
  }, [category, minRating, priceRange, maxDistance, availability, searchQuery, sortBy]);

  const filteredAndSorted = useMemo(() => {
    let results = providers.filter(p => {
      if (p.category !== category) return false;
      
      const providerRating = providerRatings[p.id]?.avg || 0;
      if (minRating > 0 && providerRating < minRating) return false;
      
      if (priceRange !== 'all') {
        if (priceRange === 'under50' && p.priceValue >= 50) return false;
        if (priceRange === '50-100' && (p.priceValue < 50 || p.priceValue > 100)) return false;
        if (priceRange === 'over100' && p.priceValue <= 100) return false;
      }

      if (maxDistance !== 'all') {
        if (p.distanceValue > parseFloat(maxDistance)) return false;
      }

      if (availability !== 'all' && p.availability !== availability) return false;

      if (searchQuery.trim() !== '') {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(lowerCaseQuery);
        const bioMatch = p.bio.toLowerCase().includes(lowerCaseQuery);
        const specialtiesMatch = p.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery));
        if (!nameMatch && !bioMatch && !specialtiesMatch) {
          return false;
        }
      }

      return true;
    });

    switch (sortBy) {
        case 'rating':
            results.sort((a, b) => (providerRatings[b.id]?.avg || 0) - (providerRatings[a.id]?.avg || 0));
            break;
        case 'price':
            results.sort((a, b) => a.priceValue - b.priceValue);
            break;
        case 'distance':
            results.sort((a, b) => a.distanceValue - b.distanceValue);
            break;
        default:
            // Default sort might be by distance or relevance
            results.sort((a, b) => a.distanceValue - b.distanceValue);
            break;
    }

    return results;
  }, [category, providers, minRating, priceRange, maxDistance, availability, searchQuery, sortBy, providerRatings]);

  const resetFilters = () => {
    setMinRating(0);
    setPriceRange('all');
    setMaxDistance('all');
    setAvailability('all');
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = minRating > 0 || priceRange !== 'all' || maxDistance !== 'all' || availability !== 'all' || !!searchQuery || sortBy !== 'default';

  const sortLabels: Record<SortOption, string> = {
    default: 'Distance',
    rating: 'Highest Rating',
    price: 'Lowest Price',
    distance: 'Closest Distance',
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${
              showFilters ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(minRating > 0 || priceRange !== 'all' || maxDistance !== 'all' || availability !== 'all') && (
              <span className="bg-emerald-400 w-2 h-2 rounded-full"></span>
            )}
          </button>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
              <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : 'text-gray-500'}`}>List</button>
              <button onClick={() => setViewMode('map')} className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white shadow-md' : 'text-gray-500'}`}>Map</button>
          </div>
        </div>

        <div className="relative w-full sm:w-auto sm:max-w-xs md:flex-grow md:max-w-sm order-last md:order-none">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          </div>
          <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialties..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl font-medium bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={sortMenuRef}>
              <button onClick={() => setSortMenuOpen(!sortMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Sort by: <span className="font-bold text-indigo-600">{sortLabels[sortBy]}</span>
                   <svg className={`w-4 h-4 transition-transform ${sortMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {sortMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-20 animate-fade-in">
                      {(Object.keys(sortLabels) as SortOption[]).map(key => (
                          <button 
                            key={key} 
                            onClick={() => { setSortBy(key); setSortMenuOpen(false); }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                              {sortLabels[key]}
                          </button>
                      ))}
                  </div>
              )}
          </div>
          <p className="text-sm text-gray-500 font-medium whitespace-nowrap hidden sm:block">
            <span className="text-gray-900 font-bold">{filteredAndSorted.length}</span> found
          </p>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {/* ... filter options ... */}
        </div>
      )}

      {/* Content Area */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800">No matching providers</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">We couldn't find anyone matching those specific filters. Try widening your search.</p>
          <button onClick={resetFilters} className="mt-6 text-indigo-600 font-bold hover:underline">Clear all filters</button>
        </div>
      ) : viewMode === 'list' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {filteredAndSorted.map(provider => {
              const ratingInfo = providerRatings[provider.id] || { avg: 0, count: 0 };
              const isFavorited = favorites.some(fav => fav.type === 'provider' && fav.id === provider.id);
              const photoSrc = provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=400&h=400&fit=crop&crop=face`;
              return (
              <div key={provider.id} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex items-end flex-shrink-0">
                  <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite('provider', provider.id); }}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
                      aria-label="Toggle Favorite"
                  >
                      <svg className={`w-6 h-6 transition-all duration-300 ${isFavorited ? 'text-rose-500 fill-current' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
                      </svg>
                  </button>
                  <div className="absolute top-4 right-16 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold flex items-center gap-1">
                    <span className="text-yellow-300">★</span> {ratingInfo.avg.toFixed(1)} <span className="opacity-70 font-normal">({ratingInfo.count})</span>
                  </div>
                  
                  <img 
                    src={photoSrc}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover transform transition-transform group-hover:scale-105"
                    alt={provider.name}
                  />
                  
                  <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-lg shadow-sm">
                    <span className={`text-[10px] font-extrabold uppercase tracking-tight ${
                      provider.availability === 'now' ? 'text-emerald-600' : 'text-orange-500'
                    }`}>
                      {provider.availability === 'now' ? '● Live' : `● Available ${provider.availability}`}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <span className="text-xs font-bold text-gray-400">{provider.distance}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {provider.specialties.map(spec => (
                      <span key={spec} className="bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border border-indigo-100">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                     <button 
                      onClick={() => onViewProfile(provider)}
                      className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => onBook(provider)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                 <ProviderMap 
                    providers={filteredAndSorted} 
                    providerRatings={providerRatings}
                    onSelectProvider={setSelectedMapProvider}
                    selectedProvider={selectedMapProvider}
                 />
            </div>
            <div className="lg:col-span-1">
                <ProviderMapInfoCard 
                    provider={selectedMapProvider}
                    ratingInfo={selectedMapProvider ? providerRatings[selectedMapProvider.id] : undefined}
                    isFavorited={selectedMapProvider ? favorites.some(f => f.type === 'provider' && f.id === selectedMapProvider.id) : false}
                    onViewProfile={onViewProfile}
                    onBook={onBook}
                    onToggleFavorite={onToggleFavorite}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default ProviderList;
