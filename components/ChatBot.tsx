
import React, { useState, useRef, useEffect } from 'react';
import { startServiceChat } from '../services/gemini';
import { Chat } from '@google/genai';
import AudioRecorder from './AudioRecorder';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>(() => {
    try {
      const saved = localStorage.getItem('lsersAiChat');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('lsersAiChat', JSON.stringify(messages));
    } catch (error) {
      console.error("Could not save AI chat to localStorage", error);
    }
  }, [messages]);

  // Initialize chat session and proactive greeting
  useEffect(() => {
    if (!chatSession) {
      startServiceChat().then(session => {
        setChatSession(session);
        // Simulate a proactive welcome message after 5 seconds if there are no messages
        if (messages.length === 0) {
          setTimeout(() => {
            const welcomeMsg = { role: 'ai' as const, text: '👋 Welcome to LSERS! I am your AI assistant. Need help finding a plumber or an oceanview villa?' };
            setMessages(prev => [...prev, welcomeMsg]);
            if (!isOpenRef.current) {
              setUnreadCount(prev => prev + 1);
            }
          }, 5000);
        }
      });
    }

    // Listen for global open event
    const handleGlobalOpen = () => setIsOpen(true);
    window.addEventListener('open-lsers-chat', handleGlobalOpen);
    return () => window.removeEventListener('open-lsers-chat', handleGlobalOpen);
  }, [chatSession]);

  // Handle auto-scroll and reset unread count when opening
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !chatSession) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const aiText = result.text || "I'm sorry, I couldn't process that. Please try again.";
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      // If the user happens to close the chat while AI is thinking, increment unread
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to service. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-gray-800 text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>

        {/* Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg animate-bounce border-2 border-white">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-indigo-600 p-6 text-white flex-shrink-0 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-xl font-bold flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              LSERS AI Assistant
            </h3>
            <p className="text-xs text-indigo-100 mt-1 opacity-80 uppercase tracking-widest font-bold relative z-10">Pro Support 24/7</p>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-4 bg-white scrollbar-hide"
          >
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-sm font-medium">Ask me anything about our professionals or properties!</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-white text-gray-700 border border-gray-100 shadow ${
                    msg.role === 'user'
                      ? 'rounded-br-none'
                      : 'rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
              className="flex-grow px-4 py-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 border border-gray-200 transition-all"
              autoFocus
            />
            <AudioRecorder 
              onTranscription={(text) => setInput(text)}
              className="bg-gray-50 hover:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
