
import React, { useState } from 'react';
import { Provider, NewProviderPayload } from '../types';
import { SERVICE_CATEGORIES } from '../constants';

interface AddProviderModalProps {
  onClose: () => void;
  onSave: (data: NewProviderPayload) => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({ onClose, onSave }) => {
  const [form, setForm] = useState<NewProviderPayload>({
    name: '',
    category: SERVICE_CATEGORIES[0].id,
    phone: '',
    priceValue: 50,
    status: 'pending' as Provider['status'],
    bio: '',
    experience: '1 year',
    specialties: [],
    certifications: [],
    photoDataUrl: '',
    latitude: 6.315,
    longitude: -10.804,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photoDataUrl) {
      alert("Please upload a profile picture.");
      return;
    }
    onSave(form);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setForm(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'specialties' | 'certifications') => {
      const { value } = e.target;
      setForm(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()) as any })); // Using 'as any' because TS struggles with array types here
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photoDataUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[92vh]">
        <div className="bg-indigo-600 p-8 text-white flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl transition-colors">✕</button>
          <h2 className="text-3xl font-black">Add New Provider</h2>
          <p className="text-indigo-100 opacity-80 font-medium">Create a new profile for the LSERS network.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
          
          <div className="flex items-center gap-6">
            <label className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center text-center text-gray-400 text-xs font-bold hover:bg-gray-200 transition-colors">
              {form.photoDataUrl ? (
                <img src={form.photoDataUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl"/>
              ) : (
                <span>Upload Photo *</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
            </label>
            <div className="flex-grow space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name *</label>
              <input required name="name" type="text" value={form.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Phone Number *</label>
              <input required name="phone" type="tel" value={form.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Hourly Rate (USD) *</label>
              <input required name="priceValue" type="number" min="0" value={form.priceValue} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Primary Service *</label>
              <select required name="category" value={form.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900">
                {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Initial Status *</label>
              <select required name="status" value={form.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Location on Map</label>
            <div className="grid grid-cols-2 gap-4">
              <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleInputChange} placeholder="Latitude" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"/>
              <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleInputChange} placeholder="Longitude" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"/>
            </div>
            <p className="text-xs text-gray-400 pl-1">Defaults to central Monrovia. Adjust for accurate map pinning.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Professional Bio *</label>
            <textarea required name="bio" rows={3} value={form.bio} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="A brief summary of their skills and experience..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Specialties</label>
              <input name="specialties" type="text" value={form.specialties.join(', ')} onChange={(e) => handleArrayChange(e, 'specialties')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="e.g. Wiring, Fixtures"/>
               <p className="text-xs text-gray-400 pl-1">Separate with commas</p>
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Certifications</label>
              <input name="certifications" type="text" value={form.certifications.join(', ')} onChange={(e) => handleArrayChange(e, 'certifications')} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900" placeholder="e.g. Verified, Licensed"/>
               <p className="text-xs text-gray-400 pl-1">Separate with commas</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              Save Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderModal;
