
import React, { useState } from 'react';
import { Provider, PortfolioItem } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface EditProviderModalProps {
  provider: Provider;
  onClose: () => void;
  onSave: (updated: Provider) => void;
}

const EditProviderModal: React.FC<EditProviderModalProps> = ({ provider, onClose, onSave }) => {
  const [form, setForm] = useState<Provider>({ ...provider });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photoDataUrl: reader.result as string, photoId: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePortfolioItem = (index: number, field: keyof PortfolioItem, value: string) => {
    const updatedPortfolio = [...(form.portfolio || [])];
    updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value };
    setForm({ ...form, portfolio: updatedPortfolio });
  };
  
  const handlePortfolioImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePortfolioItem(index, 'photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = { 
      photo: '', 
      title: 'New Project Title', 
      description: 'Briefly describe the results of this project...' 
    };
    setForm({ ...form, portfolio: [...(form.portfolio || []), newItem] });
  };

  const removePortfolioItem = (index: number) => {
    const updatedPortfolio = (form.portfolio || []).filter((_, i) => i !== index);
    setForm({ ...form, portfolio: updatedPortfolio });
  };

  const photoSrc = form.photoDataUrl || `https://images.unsplash.com/photo-${form.photoId}?w=120&h=120&fit=crop&crop=face`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[92vh]">
        <div className="bg-indigo-600 p-8 text-white flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl transition-colors">✕</button>
          <div className="flex items-center gap-6">
             <div className="relative group">
                <img 
                  src={photoSrc}
                  className="w-20 h-20 rounded-3xl border-2 border-white/30 object-cover shadow-lg"
                  alt={form.name}
                />
                 <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   <span className="text-[10px] font-bold mt-1">Change</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                 </label>
             </div>
            <div>
              <h2 className="text-3xl font-black">Edit Profile</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-indigo-100 opacity-80 font-bold">Provider ID: #{form.id}</p>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <p className="text-indigo-100 opacity-80 font-bold uppercase tracking-widest text-[10px]">{form.category}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12 overflow-y-auto scrollbar-hide">
          {/* Basic Info Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-black text-gray-900">General Information</h3>
              <div className="h-px flex-grow bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Professional Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Primary Category</label>
                <select 
                  required
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Phone</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Hourly Rate ($)</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.priceValue}
                  onChange={e => setForm({...form, priceValue: parseInt(e.target.value)})}
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Successful Jobs</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.completedJobs}
                  onChange={e => setForm({...form, completedJobs: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.latitude || ''}
                  onChange={e => setForm({...form, latitude: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold"
                  value={form.longitude || ''}
                  onChange={e => setForm({...form, longitude: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Professional Bio</label>
              <textarea 
                required
                rows={4}
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-medium leading-relaxed"
                value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
              />
            </div>
          </section>

          {/* Portfolio Management Section */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-gray-900">Portfolio Showcase</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                  {form.portfolio?.length || 0} Projects
                </span>
              </div>
              <button 
                type="button" 
                onClick={addPortfolioItem}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                + Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {(form.portfolio || []).map((item, index) => (
                <div key={index} className="group relative bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
                  
                  <div className="absolute -top-3 -right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button" 
                      onClick={() => removePortfolioItem(index)}
                      className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-rose-600 transition-all"
                      title="Delete Project"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-1/3 flex-shrink-0 space-y-4">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border-2 border-white shadow-inner relative group/image">
                          {item.photo ? (
                            <img 
                              src={item.photo}
                              className="w-full h-full object-cover"
                              alt="Project Preview"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span className="text-xs font-bold mt-1">{item.photo ? 'Change' : 'Upload'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => handlePortfolioImageChange(index, e)} />
                          </label>
                      </div>
                    </div>

                    <div className="flex-grow space-y-6 flex flex-col justify-center">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Project Name</label>
                        <input 
                          type="text" 
                          className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-black text-gray-900"
                          value={item.title}
                          placeholder="Name of this showcase project..."
                          onChange={e => updatePortfolioItem(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Project Impact & Details</label>
                        <textarea 
                          rows={4}
                          className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium leading-relaxed"
                          value={item.description}
                          placeholder="What did you achieve? Who was the client?..."
                          onChange={e => updatePortfolioItem(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!form.portfolio || form.portfolio.length === 0) && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
                  <div className="text-5xl mb-4 grayscale opacity-30">🖼️</div>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No work projects showcased yet</p>
                  <button 
                    type="button" 
                    onClick={addPortfolioItem}
                    className="mt-6 bg-white px-8 py-3 rounded-2xl text-indigo-600 font-black text-sm border border-indigo-100 shadow-sm hover:shadow-md transition-all"
                  >
                    Create your first case study
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="flex gap-6 pt-10 sticky bottom-0 bg-white/90 backdrop-blur-md pb-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-6 bg-gray-100 text-gray-600 rounded-[2rem] font-black text-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Update Profile
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProviderModal;
