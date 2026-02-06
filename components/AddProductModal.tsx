
import React, { useState } from 'react';
import { Product } from '../types';

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'sellerName' | 'sellerId'>) => void;
  showNotify: (message: string, type: 'success' | 'error' | 'info') => void;
}

const MAX_PHOTOS = 5;

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSubmit, showNotify }) => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    condition: 'New' as Product['condition'],
    sellerPhone: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > MAX_PHOTOS) {
        showNotify(`You can only upload a maximum of ${MAX_PHOTOS} photos.`, 'error');
        return;
    }

    Array.from(files).forEach(file => {
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || photos.length === 0 || !form.sellerPhone) {
        showNotify("Please fill out all required fields and upload at least one photo.", "error");
        return;
    }
    onSubmit({
        ...form,
        price: Number(form.price),
        photos: photos
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[92vh]">
        <div className="bg-rose-500 p-8 text-white flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl">✕</button>
          <h2 className="text-3xl font-bold">List an Item for Sale</h2>
          <p className="text-rose-100 mt-1">Fill in the details below to add your item to the marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Item Title *</label>
            <input 
              required
              type="text"
              name="title"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
              value={form.title}
              onChange={handleInputChange}
              placeholder="e.g. Slightly Used iPhone 13 Pro"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price (USD) *</label>
              <input 
                required
                type="number"
                name="price"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
                value={form.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Condition *</label>
              <select 
                required
                name="condition"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
                value={form.condition}
                onChange={handleInputChange}
              >
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Location *</label>
              <input 
                required
                type="text"
                name="location"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
                value={form.location}
                onChange={handleInputChange}
                placeholder="e.g. Sinkor, Monrovia"
              />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Contact Phone *</label>
                <input
                  required
                  type="tel"
                  name="sellerPhone"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
                  value={form.sellerPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. +231..."
                />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Item Photos ({photos.length}/{MAX_PHOTOS}) *</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square group">
                      <img src={photo} alt={`Upload preview ${index+1}`} className="w-full h-full rounded-xl object-cover border-2 border-white dark:border-slate-600 shadow-md"/>
                      <button type="button" onClick={() => removePhoto(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className="aspect-square cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 border-2 border-dashed border-gray-300 dark:border-slate-500 rounded-xl flex flex-col items-center justify-center text-center text-gray-400 dark:text-slate-400 font-medium transition-colors">
                  <span className="text-2xl">+</span>
                  <span className="text-xs">Add Photo</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Item Description *</label>
            <textarea 
              required
              rows={4}
              name="description"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 dark:text-white"
              placeholder="Describe your item, its condition, and any included accessories..."
              value={form.description}
              onChange={handleInputChange}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 dark:shadow-rose-900/50"
          >
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
