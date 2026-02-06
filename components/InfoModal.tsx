
import React from 'react';

interface InfoModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex-shrink-0 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-2xl">✕</button>
        </div>
        <div className="p-8 overflow-y-auto scrollbar-hide">
          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
