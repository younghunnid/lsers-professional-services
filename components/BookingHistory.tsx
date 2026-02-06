
import React from 'react';
import { BookingHistoryItem } from '../types';

interface BookingHistoryProps {
  history: BookingHistoryItem[];
  onBack: () => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ history, onBack }) => {

  const getStatusClasses = (status: BookingHistoryItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-12">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-all"
        >
          ← Back to Services
        </button>
        <div className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Booking History</h1>
            <p className="text-xl text-gray-600 mt-4">Review your past and upcoming service bookings and property rentals.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-100">
          <div className="text-6xl mb-4 opacity-40">📂</div>
          <h3 className="text-2xl font-bold text-gray-800">No Bookings Yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">Once you book a service or property, it will appear here. Start exploring to make your first booking!</p>
          <button 
            onClick={onBack} 
            className="mt-8 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Find a Service
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:shadow-xl hover:border-indigo-100">
              <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex-shrink-0 flex items-center justify-center text-4xl">
                {item.icon}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusClasses(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  With <span className="font-bold text-gray-700">{item.providerOrHost}</span> on {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="w-full sm:w-auto text-right border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 sm:ml-6">
                <p className="text-2xl font-black text-indigo-600">${item.cost.toFixed(2)}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Cost</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
