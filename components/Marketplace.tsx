
import React from 'react';
import { Product, FavoriteItem } from '../types';

interface MarketplaceProps {
  products: Product[];
  favorites: FavoriteItem[];
  onBack: () => void;
  onSellItemClick: () => void;
  onStartChat: (product: Product) => void;
  onStartWhatsApp: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onToggleFavorite: (type: 'provider' | 'product', id: number) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, favorites, onBack, onSellItemClick, onStartChat, onStartWhatsApp, onViewProduct, onToggleFavorite }) => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-all"
        >
          ← Back to Home
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Marketplace</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mt-4">Buy and sell new & used goods from the community.</p>
            </div>
            <button 
              onClick={onSellItemClick}
              className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 dark:shadow-rose-900/50 flex-shrink-0"
            >
              + Sell Your Item
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => {
          const isFavorited = favorites.some(fav => fav.type === 'product' && fav.id === product.id);
          return (
          <div 
            key={product.id} 
            className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={product.photos[0]}
                onClick={() => onViewProduct(product)}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                alt={product.title}
              />
               <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm border border-white/50 dark:border-slate-700">
                {product.condition}
              </div>
               <button 
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite('product', product.id); }}
                  className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
                  aria-label="Toggle Favorite"
              >
                  <svg className={`w-6 h-6 transition-all duration-300 ${isFavorited ? 'text-rose-500 fill-current' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
                  </svg>
              </button>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <div onClick={() => onViewProduct(product)} className="cursor-pointer">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">{product.title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">{product.location}</p>
                <div className="mt-4">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">${product.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Listed by <span className="font-bold">{product.sellerName}</span></p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onStartChat(product); }}
                  className="w-full py-3 px-4 bg-slate-800 dark:bg-slate-600 text-white rounded-xl font-bold text-sm hover:bg-black dark:hover:bg-slate-500 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  Chat in App
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onStartWhatsApp(product); }}
                  className="w-full py-3 px-4 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Marketplace;