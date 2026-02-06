
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const bg = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-indigo-600';

  return (
    <div className={`fixed top-24 right-4 z-50 ${bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in`}>
      <span className="text-xl">
        {type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <span className="font-bold">{message}</span>
    </div>
  );
};

export default Notification;
