
import React, { useState } from 'react';
import { ViewState, User, Theme } from '../types';
import { LOGO_URL } from '../constants';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  points: number;
  onNavigate: (v: ViewState) => void;
  currentView: ViewState;
  user: User | null;
  onLock: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  onEditMyProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ points, onNavigate, currentView, user, onLock, theme, onThemeToggle, onEditMyProfile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleMobileNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center h-20">
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" 
            onClick={() => onNavigate('welcome')}
          >
            <img 
              src={LOGO_URL} 
              alt="LSERS Logo" 
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-10 h-10 bg-lsers-blue rounded-xl hidden items-center justify-center text-white font-bold text-2xl shadow-lg">L</div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
               <span className="text-base sm:text-xl font-black tracking-tight text-lsers-blue dark:text-white uppercase italic">LSERS</span>
               <span className="text-[10px] sm:text-sm font-black bg-lsers-gold text-white px-1.5 py-0.5 rounded leading-none sm:skew-x-[-10deg]">HUB</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('customer')}
              className={`font-medium transition-colors ${currentView === 'customer' ? 'text-lsers-blue dark:text-lsers-gold' : 'text-slate-600 dark:text-slate-300 hover:text-lsers-blue dark:hover:text-lsers-gold'}`}
            >
              Find Services
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className={`font-medium transition-colors ${currentView === 'marketplace' ? 'text-lsers-blue dark:text-lsers-gold' : 'text-slate-600 dark:text-slate-300 hover:text-lsers-blue dark:hover:text-lsers-gold'}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => onNavigate('provider')}
              className={`font-medium transition-colors ${currentView === 'provider' ? 'text-lsers-blue dark:text-lsers-gold' : 'text-slate-600 dark:text-slate-300 hover:text-lsers-blue dark:hover:text-lsers-gold'}`}
            >
              Become a Provider
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            
            {user && (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 bg-lsers-blue/5 dark:bg-slate-800 px-4 py-2 rounded-full border border-lsers-blue/10 dark:border-slate-700 hover:border-lsers-blue/30 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-lsers-blue text-white text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-bold text-lsers-blue dark:text-slate-200">{user.name.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-lsers-blue transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-2 z-50 animate-fade-in">
                    <button onClick={() => { onNavigate('history'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-lsers-blue">My Bookings</button>
                    <button onClick={() => { onNavigate('favorites'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-lsers-blue">My Favorites</button>
                    <button onClick={() => { onEditMyProfile(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-lsers-blue">Profile Settings</button>
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">🎁 {points} pts</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button onClick={onLock} className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">Lock App</button>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle theme={theme} onToggle={onThemeToggle} />
              <button 
                className="p-2 text-lsers-blue dark:text-lsers-gold" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
            mobileMenuOpen ? 'transform translate-x-0' : 'transform translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
             <div className="flex items-center gap-2">
                <img src={LOGO_URL} className="w-8 h-8 object-contain" />
                <span className="font-black text-lsers-blue dark:text-white uppercase italic text-sm">LSERS HUB</span>
             </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <nav className="flex-grow overflow-y-auto p-4 space-y-4">
            {user && (
              <div className="p-4 bg-lsers-blue/5 dark:bg-slate-800 rounded-2xl border border-lsers-blue/10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-lsers-blue text-white text-base font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-lsers-blue dark:text-lsers-gold font-black uppercase tracking-widest">🎁 {points} pts</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <button onClick={() => handleMobileNav('history')} className="w-full text-left text-sm font-bold text-slate-700 dark:text-slate-300 p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg">My Bookings</button>
                  <button onClick={() => handleMobileNav('favorites')} className="w-full text-left text-sm font-bold text-slate-700 dark:text-slate-300 p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg">My Favorites</button>
                  <button onClick={() => { onEditMyProfile(); setMobileMenuOpen(false); }} className="w-full text-left text-sm font-bold text-slate-700 dark:text-slate-300 p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg">Profile Settings</button>
                </div>
              </div>
            )}
            
            <div className="space-y-1 text-base font-bold text-slate-700 dark:text-slate-300">
              <button onClick={() => handleMobileNav('customer')} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between">
                Find Services
                <span className="text-lsers-blue">→</span>
              </button>
              <button onClick={() => handleMobileNav('marketplace')} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between">
                Marketplace
                <span className="text-lsers-blue">→</span>
              </button>
              <button onClick={() => handleMobileNav('provider')} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between">
                Become a Provider
                <span className="text-lsers-blue">→</span>
              </button>
            </div>
          </nav>
          
          <div className="flex-shrink-0 p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
             {user && (
              <button onClick={onLock} className="w-full text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20">
                Lock Application
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
