import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, ServiceCategory, Provider, BookingRequest, Property, ConfirmationData, BookingHistoryItem, User, Product, ChatMessage, Theme, FavoriteItem, Review, NewProviderPayload, SiteContent } from './types';
import { SERVICE_CATEGORIES, MOCK_PROVIDERS, MOCK_PROPERTIES, MOCK_BOOKING_HISTORY, MOCK_USERS, MOCK_PRODUCTS, MOCK_REVIEWS, DEFAULT_SITE_CONTENT } from './constants';
import { getAiRecommendation, getProviderReply } from './services/gemini';

// Sub-components
import Header from './components/Header';
import Footer from './components/Footer';
import CategoryGrid from './components/CategoryGrid';
import ProviderList from './components/ProviderList';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import BookingModal from './components/BookingModal';
import Notification from './components/Notification';
import ChatBot from './components/ChatBot';
import AudioRecorder from './components/AudioRecorder';
import ProviderProfileModal from './components/ProviderProfileModal';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import EditProviderModal from './components/EditProviderModal';
import AddProviderModal from './components/AddProviderModal';
import BookingHistory from './components/BookingHistory';
import PinScreen from './components/PinScreen';
import Marketplace from './components/Marketplace';
import AddProductModal from './components/AddProductModal';
import BookingChoiceModal from './components/BookingChoiceModal';
import InAppChatModal from './components/InAppChatModal';
import ProductDetailModal from './components/ProductDetailModal';
import FavoritesScreen from './components/FavoritesScreen';
import InfoModal from './components/InfoModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';

const ASSET_FOLDER_KEY = 'lsersProAssetFolder';
const SITE_CONTENT_KEY = 'lsersProSiteContent';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [view, setView] = useState<ViewState>('welcome');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('lsersProTheme') as Theme;
      return savedTheme || 'light';
    } catch {
      return 'light';
    }
  });

  // Global Site Content State
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(SITE_CONTENT_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_CONTENT;
    } catch { return DEFAULT_SITE_CONTENT; }
  });

  // Simulated "Folder" for all uploaded images
  const [assetFolder, setAssetFolder] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(ASSET_FOLDER_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [providers, setProviders] = useState<Provider[]>(() => {
    try {
      const saved = localStorage.getItem('lsersProProviders');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('lsersProProviders', JSON.stringify(MOCK_PROVIDERS));
      return MOCK_PROVIDERS;
    } catch (error) {
      console.error("Failed to parse providers from localStorage", error);
      return MOCK_PROVIDERS;
    }
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
        const saved = localStorage.getItem('lsersProReviews');
        if (saved) return JSON.parse(saved);
        localStorage.setItem('lsersProReviews', JSON.stringify(MOCK_REVIEWS));
        return MOCK_REVIEWS;
    } catch (error) {
        console.error("Failed to parse reviews from localStorage", error);
        return MOCK_REVIEWS;
    }
  });
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('lsersProProducts');
      if (savedProducts) {
        return JSON.parse(savedProducts);
      } else {
        localStorage.setItem('lsersProProducts', JSON.stringify(MOCK_PRODUCTS));
        return MOCK_PRODUCTS;
      }
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
      return MOCK_PRODUCTS;
    }
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('lsersProUsers');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('lsersProUsers', JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return MOCK_USERS;
    }
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lsersProPoints');
      return saved ? JSON.parse(saved) : 250;
    } catch { return 250; }
  });

  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [profileProvider, setProfileProvider] = useState<Provider | null>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isAddingProvider, setIsAddingProvider] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [bookingChoice, setBookingChoice] = useState<{ provider: Provider; request: BookingRequest } | null>(null);
  const [activeChat, setActiveChat] = useState<{ user: User; provider: Provider } | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    try {
        const saved = localStorage.getItem('lsersProChats');
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [infoModal, setInfoModal] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Asset Folder Sync
  useEffect(() => {
    try {
      localStorage.setItem(ASSET_FOLDER_KEY, JSON.stringify(assetFolder));
    } catch (e) {
      console.error("Storage full or unavailable for asset folder", e);
    }
  }, [assetFolder]);
  
  // Site Content Sync
  useEffect(() => {
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(siteContent));
    } catch (e) {
      console.error("Storage full or unavailable for site content", e);
    }
  }, [siteContent]);

  const handleUpdateSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    showNotify("Site content updated successfully!", "success");
  };

  const saveToFolder = (base64: string): string => {
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setAssetFolder(prev => ({ ...prev, [assetId]: base64 }));
    return assetId;
  };

  const getFromFolder = (assetId: string): string | undefined => assetFolder[assetId];

  // Geolocation Effect
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                console.error("Geolocation error:", error);
                setUserLocation({ lat: 6.315, lon: -10.804 });
            }
        );
    } else {
         setUserLocation({ lat: 6.315, lon: -10.804 });
    }
  }, []);

  const providersWithDistances = useMemo(() => {
    if (!userLocation) return providers;
    return providers.map(p => {
        if (p.latitude && p.longitude) {
            const distance = getDistance(userLocation.lat, userLocation.lon, p.latitude, p.longitude);
            return {
                ...p,
                distanceValue: distance,
                distance: `${distance.toFixed(1)} miles`,
            };
        }
        return p;
    });
  }, [providers, userLocation]);
  
  useEffect(() => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('lsersProTheme', theme);
  }, [theme]);
  
  useEffect(() => {
    if (currentUser) {
        try {
            const savedFavs = localStorage.getItem(`lsersProFavorites_u${currentUser.id}`);
            setFavorites(savedFavs ? JSON.parse(savedFavs) : []);
        } catch(e) { console.error(e); }
    } else {
        setFavorites([]);
    }
  }, [currentUser]);
  
  useEffect(() => { localStorage.setItem('lsersProProducts', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('lsersProProviders', JSON.stringify(providers)); }, [providers]);
  useEffect(() => { localStorage.setItem('lsersProReviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('lsersProUsers', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('lsersProChats', JSON.stringify(chatHistories)); }, [chatHistories]);
  useEffect(() => { localStorage.setItem('lsersProPoints', JSON.stringify(points)); }, [points]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`lsersProFavorites_u${currentUser.id}`, JSON.stringify(favorites));
      } catch (error) { console.error(error); }
    }
  }, [favorites, currentUser]);


  const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  
  const handleUnlock = (name: string) => {
    setIsUnlocked(true);
    // Check for admin keyword
    if (name.toLowerCase().includes('admin')) {
      setIsAdmin(true);
    }

    const savedUser = users.find(u => u.name === name);
    if (savedUser) {
        setCurrentUser(savedUser);
    } else {
        const newUser: User = { id: Date.now(), name, email: `${name.toLowerCase().replace(/\s/g, '')}@lsers.pro` };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
    }
    showNotify(`Welcome to LSERS HUB, ${name}!`, 'success');
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setCurrentUser(null);
    setIsAdmin(false);
    showNotify("HUB Protected.", "info");
  };

  const handleThemeToggle = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const handleNavigate = (targetView: ViewState) => { setView(targetView); setSelectedCategory(null); };

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setView('customer');
  };

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const rec = await getAiRecommendation(aiQuery);
    setIsAiLoading(false);
    if (rec) {
      const cat = SERVICE_CATEGORIES.find(c => c.id === rec.categoryId);
      if (cat) {
        handleCategorySelect(cat);
        showNotify(`LSERS AI suggests: ${rec.reason}`, 'info');
      } else showNotify("AI couldn't find a matching category.", 'info');
    } else showNotify("AI search is unavailable.", 'error');
  };

  const handleBooking = (request: BookingRequest) => {
    const provider = providers.find(p => p.id === request.providerId);
    if (!provider || !currentUser) return;
    setBookingProvider(null);
    setBookingChoice({ provider, request });
  };

  const handleChooseWhatsApp = (provider: Provider, request: BookingRequest) => {
    const messageText = `🔥 NEW HUB BOOKING - LSERS\n\n` +
      `📅 Date: ${request.date}\n` +
      `⏰ Time: ${request.time}\n` +
      `👤 Client: ${request.customerName}\n` +
      `📝 Task: ${request.description}`;
    const waLink = `https://wa.me/${provider.phone.replace(/\D/g, '')}?text=${encodeURIComponent(messageText)}`;
    setConfirmationData({
      title: "Confirm Booking",
      subtitle: `Finalize session with ${provider.name}`,
      details: [
        { label: "Category", value: provider.category },
        { label: "Date", value: request.date },
        { label: "Slot", value: request.time }
      ],
      whatsappLink: waLink,
      pointsEarned: 25
    });
    setBookingChoice(null);
  };

  const handleStartInAppChat = (provider: Provider) => {
    if (!currentUser) return;
    setProfileProvider(null);
    setActiveChat({ user: currentUser, provider });
  };
  
  const handleChooseInAppChat = (provider: Provider, request: BookingRequest) => {
    handleStartInAppChat(provider);
    const chatId = `u${currentUser?.id}-p${provider.id}`;
    const systemMessage: ChatMessage = {
        sender: 'system',
        text: `Request: ${request.description} on ${request.date} (${request.time})`,
        timestamp: Date.now(),
    };
    setChatHistories(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), systemMessage]
    }));
    setBookingChoice(null);
  };

  const handleSendChatMessage = async (chatId: string, text: string) => {
    if (!activeChat) return;
    const userMessage: ChatMessage = { sender: 'user', text, timestamp: Date.now() };
    const currentHistory = chatHistories[chatId] || [];
    const updatedHistory = [...currentHistory, userMessage];
    setChatHistories(prev => ({ ...prev, [chatId]: updatedHistory }));
    setTimeout(async () => {
      const historyForApi = updatedHistory.map(m => ({ sender: m.sender, text: m.text }));
      const replyText = await getProviderReply(activeChat.provider.name, activeChat.provider.category, historyForApi);
      if (replyText) {
        const providerMessage: ChatMessage = { sender: 'provider', text: replyText, timestamp: Date.now() };
        setChatHistories(prev => ({ ...prev, [chatId]: [...updatedHistory, providerMessage] }));
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleToggleFavorite = (type: 'provider' | 'product', id: number) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.type === type && f.id === id);
      if (exists) {
        return prev.filter(f => !(f.type === type && f.id === id));
      } else {
        return [...prev, { type, id }];
      }
    });
  };

  const handleMarketplaceChat = (product: Product) => {
    if (!currentUser) {
      showNotify("Unlock the hub to chat with sellers!", "info");
      return;
    }
    const sellerProvider = providers.find(p => p.id === product.sellerId);
    if (sellerProvider) {
      setActiveChat({ user: currentUser, provider: sellerProvider });
      setViewingProduct(null);
    } else {
      showNotify(`Direct chat with ${product.sellerName} is limited. Use WhatsApp.`, 'info');
    }
  };

  const handleMarketplaceWhatsApp = (product: Product) => {
    const text = `Hi ${product.sellerName}, I'm interested in your item "${product.title}" on LSERS Marketplace.`;
    const waLink = `https://wa.me/${product.sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');
  };

  const handleUpdateProfile = (newName: string, newPin: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name: newName };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    localStorage.setItem('lsersProPin', newPin);
    setIsEditingProfile(false);
    showNotify("Profile updated!", "success");
  };

  const finalizeBooking = () => {
    if (!confirmationData) return;
    window.open(confirmationData.whatsappLink, '_blank');
    setPoints(prev => prev + confirmationData.pointsEarned);
    showNotify("Moving to WhatsApp Secure Chat...", "success");
    setConfirmationData(null);
  };

  const handleUpdateProvider = (updatedProvider: Provider) => {
    const processedProvider = { ...updatedProvider };
    if (processedProvider.photoDataUrl?.startsWith('data:')) {
      const assetId = saveToFolder(processedProvider.photoDataUrl);
      processedProvider.photoId = assetId;
      processedProvider.photoDataUrl = undefined;
    }
    
    if (processedProvider.portfolio) {
      processedProvider.portfolio = processedProvider.portfolio.map(item => {
        if (item.photo.startsWith('data:')) {
          const assetId = saveToFolder(item.photo);
          return { ...item, photo: assetId };
        }
        return item;
      });
    }

    setProviders(prev => prev.map(p => p.id === processedProvider.id ? processedProvider : p));
    setEditingProvider(null);
    showNotify(`HUB Profile: ${processedProvider.name} updated.`, 'success');
  };

  const handleAddProvider = (providerData: NewProviderPayload) => {
    const assetId = saveToFolder(providerData.photoDataUrl);
    const newProvider: Provider = {
      id: Date.now(),
      ...providerData,
      photoId: assetId,
      photoDataUrl: undefined,
      distance: '0.1 miles',
      distanceValue: 0.1,
      availability: 'now',
      responseTime: 'Quick',
      languages: ['English'],
      portfolio: [],
      completedJobs: 0,
    };
    setProviders(prev => [newProvider, ...prev]);
    setIsAddingProvider(false);
    showNotify(`Provider Profile saved in Virtual Folder.`, "success");
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'sellerName' | 'sellerId'>) => {
    if (!currentUser) return;
    const processedPhotos = newProductData.photos.map(p => p.startsWith('data:') ? saveToFolder(p) : p);
    
    const newProduct: Product = {
        ...newProductData,
        photos: processedPhotos,
        id: Date.now(),
        sellerName: currentUser.name,
        sellerId: currentUser.id,
    };
    setProducts(prev => [newProduct, ...prev]);
    setIsAddingProduct(false);
    showNotify("Marketplace item stored in Virtual Assets.", "success");
  };

  const resolveAsset = (id: string) => getFromFolder(id) || id;

  if (!isUnlocked) return <PinScreen onUnlock={handleUnlock} />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors">
      <Header 
        points={points} 
        onNavigate={handleNavigate} 
        currentView={view}
        user={currentUser}
        onLock={handleLock}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onEditMyProfile={() => setIsEditingProfile(true)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {notification && <Notification message={notification.message} type={notification.type} />}

        {view === 'welcome' && <WelcomeScreen onSelectType={(type) => handleNavigate(type)} stats={siteContent.stats} />}
        
        {view === 'customer' && (
          <div className="animate-fade-in">
            {!selectedCategory ? (
              <>
                <section className="mb-12 text-center max-w-2xl mx-auto">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Service & Goods <span className="text-lsers-blue">Simplified.</span></h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">Verified Professionals & Quality Products.</p>
                  
                  <form onSubmit={handleAiSearch} className="flex flex-col gap-2 p-2 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mb-4 sm:flex-row">
                    <div className="flex-grow flex items-center">
                      <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="What do you need? (e.g. fix my sink)"
                        className="flex-grow px-4 py-3 rounded-2xl focus:outline-none text-slate-900 dark:text-white bg-transparent"
                      />
                      <AudioRecorder onTranscription={setAiQuery} className="mx-2" />
                    </div>
                    <button type="submit" disabled={isAiLoading} className="bg-lsers-blue text-white px-8 py-3 rounded-[1.5rem] font-black hover:bg-lsers-darkBlue transition-all">
                      {isAiLoading ? 'AI SEARCHING...' : 'AI SEARCH'}
                    </button>
                  </form>
                </section>
                <div className="mb-16"><CategoryGrid onSelect={handleCategorySelect} /></div>
              </>
            ) : (
              <div>
                <button onClick={() => setSelectedCategory(null)} className="mb-6 flex items-center text-lsers-blue font-black uppercase text-xs tracking-widest hover:underline">← Back</button>
                <ProviderList 
                  category={selectedCategory.id} 
                  providers={providersWithDistances}
                  reviews={reviews}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onBook={setBookingProvider}
                  onViewProfile={setProfileProvider}
                />
              </div>
            )}
          </div>
        )}

        {view === 'provider' && <RegistrationForm onSuccess={() => { showNotify("HUB Registration Received!", "success"); setView('welcome'); }} onBack={() => setView('welcome')} />}
        {view === 'marketplace' && (
          <Marketplace 
            products={products}
            favorites={favorites}
            onBack={() => setView('customer')}
            onSellItemClick={() => setIsAddingProduct(true)}
            onStartChat={handleMarketplaceChat}
            onStartWhatsApp={handleMarketplaceWhatsApp}
            onViewProduct={setViewingProduct}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {view === 'history' && <BookingHistory history={MOCK_BOOKING_HISTORY} onBack={() => setView('customer')} />}
        {view === 'favorites' && currentUser && (
          <FavoritesScreen
            favorites={favorites}
            providers={providers}
            products={products}
            onBack={() => setView('customer')}
            onToggleFavorite={handleToggleFavorite}
            onViewProvider={setProfileProvider}
            onViewProduct={setViewingProduct}
          />
        )}
        {view === 'admin' && isAdmin && (
          <AdminPanel 
            providers={providers}
            reviews={reviews}
            users={users}
            chats={chatHistories}
            siteContent={siteContent}
            onUpdateSiteContent={handleUpdateSiteContent}
            onDelete={(id) => setProviders(prev => prev.filter(p => p.id !== id))}
            onEdit={setEditingProvider}
            onAddProvider={() => setIsAddingProvider(true)}
            onClose={() => setView('welcome')}
            onBulkDelete={(ids) => setProviders(prev => prev.filter(p => !ids.includes(p.id)))}
            onBulkStatusChange={(ids, status) => setProviders(prev => prev.map(p => ids.includes(p.id) ? { ...p, status } : p))}
          />
        )}
      </main>

      {bookingProvider && <BookingModal provider={bookingProvider} onClose={() => setBookingProvider(null)} onSubmit={handleBooking} />}
      {profileProvider && (
        <ProviderProfileModal 
          provider={{ ...profileProvider, photoDataUrl: resolveAsset(profileProvider.photoId) }} 
          reviews={reviews.filter(r => r.providerId === profileProvider.id)}
          currentUser={currentUser}
          favorites={favorites}
          onClose={() => setProfileProvider(null)} 
          onBook={setBookingProvider}
          onStartInAppChat={handleStartInAppChat}
          onToggleFavorite={handleToggleFavorite}
          onAddReview={(pid, r, c) => setReviews(prev => [...prev, { id: Date.now(), providerId: pid, authorId: currentUser?.id || 0, authorName: currentUser?.name || 'User', rating: r, comment: c, timestamp: Date.now() }])}
        />
      )}
      {editingProvider && <EditProviderModal provider={editingProvider} onClose={() => setEditingProvider(null)} onSave={handleUpdateProvider} />}
      {isAddingProvider && <AddProviderModal onClose={() => setIsAddingProvider(false)} onSave={handleAddProvider} />}
      {confirmationData && <BookingConfirmationModal data={confirmationData} onConfirm={finalizeBooking} onCancel={() => setConfirmationData(null)} />}
      {bookingChoice && <BookingChoiceModal provider={bookingChoice.provider} request={bookingChoice.request} onClose={() => setBookingChoice(null)} onChooseInAppChat={handleChooseInAppChat} onChooseWhatsApp={handleChooseWhatsApp} />}
      {activeChat && currentUser && <InAppChatModal chatPartner={activeChat.provider} currentUser={currentUser} history={chatHistories[`u${currentUser.id}-p${activeChat.provider.id}`] || []} onClose={() => setActiveChat(null)} onSendMessage={handleSendChatMessage} />}
      {isAddingProduct && <AddProductModal onClose={() => setIsAddingProduct(false)} onSubmit={handleAddProduct} showNotify={showNotify} />}
      {viewingProduct && <ProductDetailModal product={{ ...viewingProduct, photos: viewingProduct.photos.map(resolveAsset) }} favorites={favorites} onClose={() => setViewingProduct(null)} onStartChat={handleMarketplaceChat} onStartWhatsApp={handleMarketplaceWhatsApp} onToggleFavorite={handleToggleFavorite} />}
      {infoModal && <InfoModal title={infoModal.title} onClose={() => setInfoModal(null)}>{infoModal.content}</InfoModal>}
      {isEditingProfile && currentUser && <ProfileSettingsModal userName={currentUser.name} onClose={() => setIsEditingProfile(false)} onSave={handleUpdateProfile} onManageProvider={() => { const p = providers.find(p => p.id === currentUser.providerId); if(p) setEditingProvider(p); }} isProvider={!!currentUser.providerId} />}

      <ChatBot />
      <Footer 
        onNavigate={handleNavigate} 
        currentUser={currentUser} 
        onEditMyProfile={() => setIsEditingProfile(true)} 
        onShowInfo={setInfoModal}
        content={{...siteContent}} 
      />
    </div>
  );
};

export default App;