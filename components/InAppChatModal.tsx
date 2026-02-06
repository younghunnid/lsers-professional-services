
import React, { useState, useRef, useEffect } from 'react';
import { Provider, User, ChatMessage } from '../types';

interface InAppChatModalProps {
  chatPartner: Provider;
  currentUser: User;
  history: ChatMessage[];
  onClose: () => void;
  onSendMessage: (chatId: string, text: string) => void;
}

const InAppChatModal: React.FC<InAppChatModalProps> = ({ chatPartner, currentUser, history, onClose, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatId = `u${currentUser.id}-p${chatPartner.id}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Check if the last message was from the user to simulate 'typing'
    if (history.length > 0 && history[history.length - 1].sender === 'user') {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(chatId, input.trim());
    setInput('');
  };
  
  const partnerPhotoSrc = chatPartner.photoDataUrl || `https://images.unsplash.com/photo-${chatPartner.photoId}?w=100&h=100&fit=crop&crop=face`;

  const getSenderAvatar = (sender: ChatMessage['sender']) => {
    if (sender === 'user') {
      return (
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {currentUser.name.charAt(0)}
        </div>
      );
    }
    if (sender === 'provider') {
      return <img src={partnerPhotoSrc} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col h-[80vh] max-h-[700px]">
        <div className="bg-white p-5 flex-shrink-0 border-b border-gray-100 flex items-center gap-4">
           <img src={partnerPhotoSrc} className="w-12 h-12 rounded-full object-cover" />
           <div>
             <h3 className="font-bold text-lg text-gray-900">{chatPartner.name}</h3>
             <p className="text-sm text-gray-500 capitalize">{chatPartner.category.replace('-', ' ')}</p>
           </div>
           <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-800 text-2xl">✕</button>
        </div>
        
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-white scrollbar-hide">
          {history.map((msg, i) => {
             if (msg.sender === 'system') {
                return (
                    <div key={i} className="text-center text-xs text-gray-400 italic bg-gray-200 rounded-full py-1 px-3 mx-auto max-w-xs">
                        {msg.text}
                    </div>
                )
             }
            return (
              <div key={i} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {getSenderAvatar(msg.sender)}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow bg-white text-gray-800 border border-gray-100 ${
                    msg.sender === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            )
          })}
          {isTyping && (
             <div className="flex items-end gap-3">
               {getSenderAvatar('provider')}
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 border border-gray-200 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InAppChatModal;
