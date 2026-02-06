
import React from 'react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ isOpen, onClose, onConfirm, title, confirmText = 'Confirm', cancelText = 'Cancel', children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <div className="text-slate-600 dark:text-slate-400 mt-2">
            {children}
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-colors">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
