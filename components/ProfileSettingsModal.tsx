
import React, { useState } from 'react';

interface ProfileSettingsModalProps {
  userName: string;
  onClose: () => void;
  onSave: (name: string, pin: string) => void;
  onManageProvider: () => void;
  isProvider: boolean;
}

const REGISTRY_KEY = 'lsersProUserRegistry';

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ userName, onClose, onSave, onManageProvider, isProvider }) => {
  const [name, setName] = useState(userName);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const syncToRegistry = (newName: string, newPin: string) => {
    try {
      const data = localStorage.getItem(REGISTRY_KEY);
      let registry = data ? JSON.parse(data) : [];
      // Remove old entry if same name or same original name
      registry = registry.filter((u: any) => u.name.toLowerCase() !== userName.toLowerCase() && u.name.toLowerCase() !== newName.toLowerCase());
      registry.push({ name: newName, pin: newPin });
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    } catch(e) { console.error(e); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    let finalPin = localStorage.getItem('lsersProPin') || '';
    if (pin.length > 0 || confirmPin.length > 0) {
        if (pin.length !== 4) {
          setError('PIN must be 4 digits');
          return;
        }
        if (pin !== confirmPin) {
          setError('PINs do not match');
          return;
        }
        finalPin = pin;
    }

    syncToRegistry(name.trim(), finalPin);
    onSave(name.trim(), finalPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col">
        <div className="bg-indigo-600 p-8 text-white flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl">✕</button>
          <h2 className="text-3xl font-black">Profile Settings</h2>
          <p className="text-indigo-100 opacity-80 font-medium mt-1">Manage your identity and security.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security (Change PIN)</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Leave blank to keep"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Repeat PIN"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold text-center"
                />
              </div>
            </div>
          </div>

          {isProvider && (
            <div className="pt-4">
               <button 
                  type="button"
                  onClick={onManageProvider}
                  className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-900/50"
                >
                  Manage Provider Portfolio & Bio
                </button>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
