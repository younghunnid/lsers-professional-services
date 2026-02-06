
import React, { useState } from 'react';
import { Provider, BookingRequest } from '../types';

interface BookingModalProps {
  provider: Provider;
  onClose: () => void;
  onSubmit: (request: BookingRequest) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ provider, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, providerId: provider.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-indigo-600 p-8 text-white">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl">✕</button>
          <div className="flex items-center gap-4">
             <img 
              src={provider.photoDataUrl || `https://images.unsplash.com/photo-${provider.photoId}?w=100&h=100&fit=crop&crop=face`}
              className="w-16 h-16 rounded-2xl border-2 border-white/30 object-cover"
              alt={provider.name}
            />
            <div>
              <h2 className="text-2xl font-bold">Book {provider.name}</h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                value={form.customerName}
                onChange={e => setForm({...form, customerName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                value={form.customerPhone}
                onChange={e => setForm({...form, customerPhone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time</label>
              <select 
                required
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                value={form.time}
                onChange={e => setForm({...form, time: e.target.value})}
              >
                <option value="">Select Time</option>
                <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Description</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Describe what needs to be done..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            Confirm & Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;