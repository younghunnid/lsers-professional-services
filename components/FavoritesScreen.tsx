
import React from 'react';
import { FavoriteItem, Provider, Product } from '../types';

interface FavoritesScreenProps {
  favorites: FavoriteItem[];
  providers: Provider[];
  products: Product[];
  onBack: () => void;
  onToggleFavorite: (type: 'provider' | 'product', id: number) => void;
  onViewProvider: (provider: Provider) => void;
  onViewProduct: (product: Product) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favorites, providers, products, onBack, onToggleFavorite, onViewProvider, onViewProduct }) => {
  const favoriteProviders = favorites
    .filter(f => f.type === 'provider')
    .map(f => providers.find(p => p.id === f.id))
    .filter((p): p is Provider => p !== undefined);

  const favoriteProducts = favorites
    .filter(f => f.type === 'product')
    .map(f => products.find(p => p.id === f.id))
    .filter((p): p is Product => p !== undefined);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-12">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-all"
        >
          ← Back to Services
        </button>
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Favorites</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mt-4">Your saved professionals and marketplace items, all in one place.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-4 opacity-40">🤍</div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Your Favorites List is Empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">Click the heart icon on any provider or item to save it here for later!</p>
          <button 
            onClick={onBack} 
            className="mt-8 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Favorite Providers */}
          {favoriteProviders.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Saved Professionals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteProviders.map(provider => (
                  <div key={`provider-${provider.id}`} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <img src={`https://images.unsplash.com/photo-${provider.photoId}?w=100&h=100&fit=crop&crop=face`} className="w-16 h-16 rounded-2xl object-cover" alt={provider.name}/>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">{provider.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{provider.category.replace('-', ' ')}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                        <button onClick={() => onViewProvider(provider)} className="flex-1 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">View</button>
                        <button onClick={() => onToggleFavorite('provider', provider.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 hover:bg-rose-100 rounded-xl">
                           <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Favorite Products */}
          {favoriteProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Saved Marketplace Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {favoriteProducts.map(product => (
                  <div key={`product-${product.id}`} className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden group flex flex-col">
                     <img src={product.photos[0]} onClick={() => onViewProduct(product)} className="h-48 w-full object-cover cursor-pointer" alt={product.title}/>
                     <div className="p-5 flex-grow flex flex-col">
                        <h3 onClick={() => onViewProduct(product)} className="font-bold text-slate-800 dark:text-slate-100 cursor-pointer">{product.title}</h3>
                        <p className="text-xl font-black text-rose-500 dark:text-rose-400 mt-1">${product.price.toLocaleString()}</p>
                        <div className="mt-auto pt-4 flex gap-2">
                             <button onClick={() => onViewProduct(product)} className="flex-1 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">View</button>
                            <button onClick={() => onToggleFavorite('product', product.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 hover:bg-rose-100 rounded-xl">
                               <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
