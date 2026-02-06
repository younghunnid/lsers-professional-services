
import React, { useState, useEffect } from 'react';
import { MOCK_USERS, LOGO_URL } from '../constants';

interface PinScreenProps {
  onUnlock: (name: string) => void;
}

const PIN_KEY = 'lsersProPin';
const NAME_KEY = 'lsersProUserName';
const REGISTRY_KEY = 'lsersProUserRegistry';

type ScreenState = 
  | 'choice' 
  | 'entering_name_new' 
  | 'entering_name_login' 
  | 'creating_pin' 
  | 'confirming_pin' 
  | 'entering_pin_unlock' 
  | 'entering_pin_login'
  | 'setup_questions'
  | 'forgot_pin_name'
  | 'recovery_questions';

interface SecurityQuestionAnswer {
  question: string;
  answer: string;
}

interface RegisteredUser {
  name: string;
  pin: string;
  securityQuestions: SecurityQuestionAnswer[];
}

const QUESTIONS_LIST = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your primary school?",
  "In what city were you born?",
  "What was your first car?",
  "What is your favorite food?"
];

const DEFAULT_RECOVERY: SecurityQuestionAnswer[] = [
  { question: QUESTIONS_LIST[0], answer: "Buddy" },
  { question: QUESTIONS_LIST[1], answer: "Smith" },
  { question: QUESTIONS_LIST[3], answer: "Monrovia" }
];
const DEFAULT_PIN = "1234";

const PinScreen: React.FC<PinScreenProps> = ({ onUnlock }) => {
  const [screen, setScreen] = useState<ScreenState>('choice');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('Welcome');
  
  const [setupStep, setSetupStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<SecurityQuestionAnswer[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const [recoveryAnswers, setRecoveryAnswers] = useState<string[]>(['', '', '']);

  useEffect(() => {
    try {
      const storedPin = localStorage.getItem(PIN_KEY);
      const storedName = localStorage.getItem(NAME_KEY);
      
      if (storedPin && storedName) {
        setScreen('entering_pin_unlock');
        setUserName(storedName);
        setTitle(`Hi, ${storedName.split(' ')[0]}`);
      } else {
        setScreen('choice');
        setTitle('Welcome');
      }
    } catch (e) {
      console.error("Storage access error", e);
      onUnlock('Guest');
    }
  }, [onUnlock]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getRegistry = (): RegisteredUser[] => {
    try {
      const localData = localStorage.getItem(REGISTRY_KEY);
      const localRegistry: RegisteredUser[] = localData ? JSON.parse(localData) : [];
      
      const mockRegistry: RegisteredUser[] = MOCK_USERS.map(u => ({
        name: u.name,
        pin: DEFAULT_PIN,
        securityQuestions: DEFAULT_RECOVERY
      }));

      const registryMap = new Map<string, RegisteredUser>();
      mockRegistry.forEach(u => registryMap.set(u.name.toLowerCase(), u));
      localRegistry.forEach(u => registryMap.set(u.name.toLowerCase(), u));

      return Array.from(registryMap.values());
    } catch { return []; }
  };

  const saveToRegistry = (name: string, pin: string, questions: SecurityQuestionAnswer[]) => {
    try {
      const localData = localStorage.getItem(REGISTRY_KEY);
      let localRegistry: RegisteredUser[] = localData ? JSON.parse(localData) : [];
      
      const filtered = localRegistry.filter(u => u.name.toLowerCase() !== name.toLowerCase());
      filtered.push({ name, pin, securityQuestions: questions });
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(filtered));
      
      localStorage.setItem(PIN_KEY, pin);
      localStorage.setItem(NAME_KEY, name);
    } catch (e) {
      console.error("Failed to save registry", e);
    }
  };

  const handleKeyPress = (digit: string) => {
    setError('');
    const currentPin = screen === 'confirming_pin' ? confirmPin : pin;
    if (currentPin.length < 4) {
      if (screen === 'confirming_pin') setConfirmPin(currentPin + digit);
      else setPin(currentPin + digit);
    }
  };

  const handleDelete = () => {
    setError('');
    if (screen === 'confirming_pin') setConfirmPin(prev => prev.slice(0, -1));
    else setPin(prev => prev.slice(0, -1));
  };
  
  const handleAction = () => {
    const registry = getRegistry();

    if (screen === 'entering_name_new') {
      if (!userName.trim()) {
        setError('Please enter your name');
        return;
      }
      setScreen('creating_pin');
      setTitle('Create PIN');
    } 
    else if (screen === 'creating_pin') {
      if (pin.length !== 4) {
        setError('PIN must be 4 digits');
        return;
      }
      setScreen('confirming_pin');
      setTitle('Confirm PIN');
    } 
    else if (screen === 'confirming_pin') {
      if (pin === confirmPin) {
        const existingUser = registry.find(u => u.name.toLowerCase() === userName.trim().toLowerCase());
        if (existingUser) {
           saveToRegistry(existingUser.name, pin, existingUser.securityQuestions);
           onUnlock(existingUser.name);
        } else {
           setScreen('setup_questions');
           setSetupStep(0);
           setTitle('Security Layer');
        }
      } else {
        setError('PINs do not match');
        setPin('');
        setConfirmPin('');
        setScreen('creating_pin');
      }
    }
    else if (screen === 'setup_questions') {
      const current = selectedQuestions[setupStep];
      if (!current.question || !current.answer.trim()) {
        setError('Answer required');
        return;
      }
      if (setupStep < 2) {
        setSetupStep(setupStep + 1);
      } else {
        saveToRegistry(userName.trim(), pin, selectedQuestions);
        onUnlock(userName.trim());
      }
    }
    else if (screen === 'entering_name_login') {
      if (!userName.trim()) {
        setError('Please enter your name');
        return;
      }
      const user = registry.find(u => u.name.toLowerCase() === userName.trim().toLowerCase());
      if (!user) {
        setError('Profile not found');
        return;
      }
      setScreen('entering_pin_login');
      setTitle(`Welcome Back`);
    }
    else if (screen === 'entering_pin_login') {
      const user = registry.find(u => u.name.toLowerCase() === userName.trim().toLowerCase());
      if (user && user.pin === pin) {
        localStorage.setItem(PIN_KEY, pin);
        localStorage.setItem(NAME_KEY, user.name);
        onUnlock(user.name);
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
    else if (screen === 'entering_pin_unlock') {
      const storedPin = localStorage.getItem(PIN_KEY);
      if (pin === storedPin) {
        onUnlock(userName);
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
    else if (screen === 'forgot_pin_name') {
      if (!userName.trim()) {
        setError('Please enter your name');
        return;
      }
      const user = registry.find(u => u.name.toLowerCase() === userName.trim().toLowerCase());
      if (!user || !user.securityQuestions || user.securityQuestions.length < 3) {
        setError('Recovery not available');
        return;
      }
      setScreen('recovery_questions');
      setSetupStep(0);
      setTitle('Reset PIN');
    }
    else if (screen === 'recovery_questions') {
      const user = registry.find(u => u.name.toLowerCase() === userName.trim().toLowerCase());
      if (!user) return;
      const correctAnswer = user.securityQuestions[setupStep].answer.toLowerCase().trim();
      const providedAnswer = recoveryAnswers[setupStep].toLowerCase().trim();
      if (correctAnswer === providedAnswer) {
        if (setupStep < 2) {
          setSetupStep(setupStep + 1);
        } else {
          setScreen('creating_pin');
          setTitle('New PIN');
          setPin('');
          setConfirmPin('');
          setError('');
        }
      } else {
        setError('Incorrect answer');
      }
    }
  };

  const displayPin = screen === 'confirming_pin' ? confirmPin : pin;
  const shakeClass = error ? 'animate-shake' : '';

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-start p-6 overflow-y-auto scrollbar-hide">
      
      {/* BRANDING SECTION - Optimized for Mobile */}
      <div className="w-full max-w-sm flex flex-col items-center pt-8 mb-10 text-center animate-fade-in">
        <div className="relative mb-6">
          {/* Logo container that mimics the shield/stars style */}
          <div className="absolute inset-0 bg-lsers-blue rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <img 
            src={LOGO_URL} 
            alt="LSERS HUB Logo" 
            className="relative w-32 h-auto object-contain drop-shadow-2xl"
            onError={(e) => {
                // Fallback icon if logo.png isn't found
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-24 h-24 bg-lsers-blue rounded-[2rem] shadow-xl flex items-center justify-center text-white text-5xl font-black">L</div>
        </div>
        
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-black tracking-tighter leading-tight flex items-center gap-1">
                <span className="text-lsers-blue dark:text-white uppercase italic">LSERS</span>
                <span className="bg-lsers-gold text-white px-3 py-1 rounded-lg text-xl skew-x-[-12deg] shadow-lg">HUB</span>
            </h1>
            <div className="w-full max-w-[120px] h-1 bg-lsers-gold mt-1 rounded-full opacity-30"></div>
        </div>
      </div>

      <div className={`w-full max-w-sm flex flex-col items-center ${shakeClass}`}>
        
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight text-center">
          {title}
        </h2>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 h-4 text-center font-bold tracking-tight px-4 uppercase tracking-[0.1em]">
            {error ? <span className="text-rose-500 animate-pulse">{error}</span> : 
             screen === 'choice' ? 'Professional Services & Goods' :
             screen === 'setup_questions' ? `Security Layer ${setupStep + 1}/3` :
             screen === 'recovery_questions' ? `Verification ${setupStep + 1}/3` :
             'Secure Access'}
        </p>

        {/* Action: Choice Screen */}
        {screen === 'choice' && (
          <div className="w-full space-y-4 animate-fade-in px-2">
             <button 
                onClick={() => { setScreen('entering_name_new'); setTitle('Setup'); setUserName(''); setPin(''); }}
                className="w-full py-5 bg-lsers-blue text-white rounded-[1.5rem] font-black text-lg hover:bg-lsers-darkBlue transition-all shadow-xl shadow-lsers-blue/20 active:scale-95 flex flex-col items-center"
             >
               Start New Journey
               <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Create Profile</p>
             </button>
             <button 
                onClick={() => { setScreen('entering_name_login'); setTitle('Login'); setUserName(''); setPin(''); }}
                className="w-full py-5 bg-white dark:bg-slate-800 text-lsers-blue dark:text-lsers-gold rounded-[1.5rem] font-black text-lg border-2 border-slate-100 dark:border-slate-700 hover:border-lsers-gold transition-all active:scale-95 flex flex-col items-center"
             >
               Welcome Back
               <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Sign In</p>
             </button>
          </div>
        )}

        {/* Action: Name Input */}
        {(screen === 'entering_name_new' || screen === 'entering_name_login' || screen === 'forgot_pin_name') && (
          <div className="w-full animate-fade-in space-y-4 px-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 focus:outline-none focus:border-lsers-blue text-slate-900 dark:text-white font-bold text-lg"
                autoFocus
              />
            </div>
            <button 
              onClick={handleAction}
              className="w-full py-5 bg-lsers-blue text-white rounded-[1.5rem] font-black text-lg shadow-lg active:scale-95"
            >
              Continue
            </button>
            <button 
              onClick={() => setScreen('choice')}
              className="w-full text-slate-400 font-black text-xs uppercase tracking-widest hover:text-lsers-blue pt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Action: Setup Questions */}
        {screen === 'setup_questions' && (
          <div className="w-full space-y-4 animate-fade-in px-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Choose Question</label>
              <select 
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm appearance-none"
                value={selectedQuestions[setupStep].question}
                onChange={(e) => {
                  const updated = [...selectedQuestions];
                  updated[setupStep].question = e.target.value;
                  setSelectedQuestions(updated);
                }}
              >
                <option value="">Select Security Question...</option>
                {QUESTIONS_LIST.map(q => (
                  <option key={q} value={q} disabled={selectedQuestions.some((sq, i) => i !== setupStep && sq.question === q)}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Answer</label>
              <input
                type="text"
                value={selectedQuestions[setupStep].answer}
                onChange={(e) => {
                  const updated = [...selectedQuestions];
                  updated[setupStep].answer = e.target.value;
                  setSelectedQuestions(updated);
                }}
                className="w-full px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                placeholder="Type your answer"
              />
            </div>
            <button onClick={handleAction} className="w-full py-5 bg-lsers-blue text-white rounded-[1.5rem] font-black text-lg active:scale-95">
              {setupStep === 2 ? 'Finish Setup' : 'Next Step'}
            </button>
          </div>
        )}

        {/* Action: Recovery Questions */}
        {screen === 'recovery_questions' && (
          <div className="w-full space-y-4 animate-fade-in px-2">
            <div className="p-5 bg-lsers-blue/5 dark:bg-lsers-blue/20 rounded-[1.5rem] border-2 border-lsers-blue/10">
              <p className="text-[10px] font-black text-lsers-blue dark:text-lsers-gold uppercase tracking-widest mb-1">Recovery Task</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {getRegistry().find(u => u.name.toLowerCase() === userName.toLowerCase())?.securityQuestions[setupStep].question}
              </p>
            </div>
            <input
              type="text"
              value={recoveryAnswers[setupStep]}
              onChange={(e) => {
                const updated = [...recoveryAnswers];
                updated[setupStep] = e.target.value;
                setRecoveryAnswers(updated);
              }}
              className="w-full px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              placeholder="Answer..."
              autoFocus
            />
            <button onClick={handleAction} className="w-full py-5 bg-lsers-blue text-white rounded-[1.5rem] font-black text-lg active:scale-95">
              Verify
            </button>
          </div>
        )}

        {/* Action: PIN Keypad */}
        {(screen === 'creating_pin' || screen === 'confirming_pin' || screen === 'entering_pin_unlock' || screen === 'entering_pin_login') && (
          <div className="animate-fade-in w-full flex flex-col items-center">
            
            {/* PIN Indicator Dots */}
            <div className="flex items-center gap-6 mb-8 h-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i < displayPin.length
                      ? 'bg-lsers-gold scale-150 shadow-[0_0_15px_rgba(255,189,0,0.4)]'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(String(num))}
                  className="h-16 w-16 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-2xl font-black text-slate-800 dark:text-white shadow-sm hover:bg-lsers-gold hover:text-white active:scale-90 transition-all mx-auto"
                >
                  {num}
                </button>
              ))}
              <div /> 
              <button
                onClick={() => handleKeyPress('0')}
                className="h-16 w-16 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full text-2xl font-black text-slate-800 dark:text-white shadow-sm hover:bg-lsers-gold hover:text-white active:scale-90 transition-all mx-auto"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="h-16 w-16 flex items-center justify-center bg-transparent rounded-full text-slate-300 hover:text-rose-500 active:scale-90 transition-all mx-auto"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 10h18M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4M7 10l-1.293 1.293a1 1 0 000 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 000-1.414L17 10H7z"></path></svg>
              </button>
            </div>
            
            <button 
              onClick={handleAction}
              className="w-full mt-10 py-5 bg-lsers-blue text-white rounded-[1.5rem] font-black text-lg hover:bg-lsers-darkBlue transition-all shadow-xl disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              disabled={displayPin.length < 4}
            >
              {screen === 'creating_pin' ? 'Set Code' : 
               screen === 'confirming_pin' ? 'Confirm' : 
               screen === 'entering_pin_login' ? 'Authorizing...' : 'Unlock'}
            </button>

            {(screen === 'entering_pin_unlock' || screen === 'entering_pin_login') && (
              <div className="mt-8 flex flex-col items-center gap-4">
                  <button 
                    onClick={() => { setScreen('forgot_pin_name'); setTitle('Reset'); setPin(''); }}
                    className="text-lsers-blue dark:text-lsers-gold font-black text-xs hover:underline tracking-tight uppercase"
                  >
                    Forgot Security PIN?
                  </button>
                  <button 
                    onClick={() => { setScreen('choice'); setPin(''); }}
                    className="text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-lsers-blue transition-colors"
                  >
                    Switch Profile
                  </button>
              </div>
            )}
          </div>
        )}
      </div>

       <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PinScreen;
