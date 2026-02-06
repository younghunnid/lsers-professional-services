
import React from 'react';
import { ConfirmationData } from '../types';

interface BookingConfirmationModalProps {
  data: ConfirmationData;
  onConfirm: () => void;
  onCancel: () => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ data, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-fade-in" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-emerald-500 p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✨</div>
          <h2 className="text-3xl font-black">{data.title}</h2>
          <p className="text-emerald-50 font-medium mt-2">{data.subtitle}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Booking Summary</h3>
            <div className="space-y-3">
              {data.details.map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="text-sm font-bold text-gray-500">{detail.label}</span>
                  <span className="text-sm font-black text-gray-900">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <span className="text-xl">📱</span>
              <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                <strong>Next Step:</strong> Clicking the button below will open WhatsApp with a pre-filled message for the {data.details[0].value.includes('Stay') ? 'host' : 'provider'}.
              </p>
            </div>
            
            <button 
              onClick={onConfirm}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              Confirm & Go to WhatsApp
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            <button 
              onClick={onCancel}
              className="w-full text-center text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Need to change something? Go back
            </button>
          </div>
          
          <div className="text-center pt-2">
            <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              🎁 +{data.pointsEarned} Points Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
