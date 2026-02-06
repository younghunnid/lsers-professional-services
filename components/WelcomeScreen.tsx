
import React from 'react';
import { ViewState, SiteStats } from '../types';
import { LOGO_URL } from '../constants';

interface WelcomeScreenProps {
  onSelectType: (type: ViewState) => void;
  stats: SiteStats;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectType, stats }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16 flex flex-col items-center">
        <div className="relative mb-8 group">
          {/* Logo Background Glow */}
          <div className="absolute inset-0 bg-lsers-blue rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity animate-pulse"></div>
          
          <img 
            src={LOGO_URL} 
            alt="LSERS Logo" 
            className="relative w-48 h-48 object-contain drop-shadow-2xl animate-fade-in"
            style={{ animationDelay: '0.1s' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          
          {/* Fallback Logo Brand Shield */}
          <div className="hidden w-48 h-48 bg-lsers-blue rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden animate-fade-in">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-9xl font-black">L</span>
             </div>
             <span className="text-8xl font-black italic relative z-10">L</span>
             <div className="bg-lsers-gold px-4 py-1 rounded-lg text-xs font-black skew-x-[-10deg] absolute bottom-6 shadow-lg">HUB</div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Service & Goods <span className="text-lsers-blue">Simplified.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          LSERS connects verified professionals and sellers with clients seeking reliable services and quality products in Liberia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Customer Card */}
        <div 
          onClick={() => onSelectType('customer')}
          className="group relative bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:border-lsers-blue/20"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:bg-lsers-blue group-hover:text-white transition-colors duration-500">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">I Need a Service</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Browse verified professionals for home repairs, tech support, or creative projects.</p>
          <div className="inline-flex items-center font-bold text-lsers-blue group-hover:gap-2 transition-all">
            Get Started <span className="ml-2">→</span>
          </div>
        </div>

        {/* Provider Card */}
        <div 
          onClick={() => onSelectType('provider')}
          className="group relative bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:border-lsers-gold/20"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:bg-lsers-gold group-hover:text-lsers-darkBlue transition-colors duration-500">💼</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">I Offer Services</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Join Liberia's premier network of professionals. Grow your business and reach verified clients.</p>
          <div className="inline-flex items-center font-bold text-lsers-darkBlue group-hover:gap-2 transition-all">
            Become a Provider <span className="ml-2">→</span>
          </div>
        </div>

        {/* Marketplace Card */}
        <div 
          onClick={() => onSelectType('marketplace')}
          className="group relative bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:border-rose-200"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-500">🛍️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketplace</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Buy and sell new or used items locally. Find great deals on everything from electronics to vehicles.</p>
          <div className="inline-flex items-center font-bold text-rose-500 group-hover:gap-2 transition-all">
            Start Shopping <span className="ml-2">→</span>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 pt-16">
        <div>
            <div className="text-4xl font-bold text-lsers-blue mb-1">{stats.pros.value}</div>
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black">{stats.pros.label}</div>
        </div>
        <div>
            <div className="text-4xl font-bold text-emerald-600 mb-1">{stats.clients.value}</div>
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black">{stats.clients.label}</div>
        </div>
        <div>
            <div className="text-4xl font-bold text-lsers-gold mb-1">{stats.items.value}</div>
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black">{stats.items.label}</div>
        </div>
        <div>
            <div className="text-4xl font-bold text-purple-600 mb-1">{stats.support.value}</div>
            <div className="text-gray-500 uppercase tracking-widest text-[10px] font-black">{stats.support.label}</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
